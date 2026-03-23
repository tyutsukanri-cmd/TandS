import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

function safeSegment(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '').slice(0, 80)
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const form = await request.formData()
    const file = form.get('file')
    const fileNameRaw = String(form.get('fileName') || '')
    const dateFolderRaw = String(form.get('dateFolder') || '')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 })
    }
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      return NextResponse.json({ error: 'png形式の画像のみアップロードできます' }, { status: 400 })
    }

    const dateFolder = safeSegment(dateFolderRaw || '')
    if (!/^\d{8}$/.test(dateFolder)) {
      return NextResponse.json({ error: '日付パラメータが不正です' }, { status: 400 })
    }

    const fileName = safeSegment(fileNameRaw || file.name) || 'upload.png'
    if (!fileName.toLowerCase().endsWith('.png')) {
      return NextResponse.json({ error: 'ファイル名は .png で終わる必要があります' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const dirOnDisk = path.join(process.cwd(), 'public', 'uploaded', safeSegment(user.username), dateFolder)
    await mkdir(dirOnDisk, { recursive: true })
    const fullPath = path.join(dirOnDisk, fileName)
    await writeFile(fullPath, buffer)

    const filePath = `/uploaded/${encodeURIComponent(user.username)}/${dateFolder}/${encodeURIComponent(fileName)}`
    return NextResponse.json({ success: true, fileName, filePath })
  } catch (error: any) {
    if (error.message === '未ログインです') {
      return NextResponse.json({ error: 'ログインしてください' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'アップロードに失敗しました' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json().catch(() => null)
    const filePathRaw = String(body?.filePath || '')
    if (!filePathRaw) return NextResponse.json({ error: 'filePathがありません' }, { status: 400 })

    // strip query
    const filePath = filePathRaw.split('?')[0]
    const prefix = `/uploaded/${encodeURIComponent(user.username)}/`
    if (!filePath.startsWith(prefix)) {
      return NextResponse.json({ error: '该ファイルの削除権限がありません' }, { status: 403 })
    }

    const rel = filePath.slice('/uploaded/'.length) // "<username>/<date>/<name>"
    const parts = rel.split('/').map((p) => decodeURIComponent(p))
    if (parts.length < 3) {
      return NextResponse.json({ error: 'filePathの形式が正しくありません' }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), 'public', 'uploaded', ...parts)
    const allowedBase = path.join(process.cwd(), 'public', 'uploaded', user.username)
    const resolvedFull = path.resolve(fullPath)
    const resolvedBase = path.resolve(allowedBase)
    if (!resolvedFull.startsWith(resolvedBase)) {
      return NextResponse.json({ error: '無効なパスです' }, { status: 400 })
    }

    await unlink(resolvedFull).catch(() => null)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === '未ログインです') {
      return NextResponse.json({ error: 'ログインしてください' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || '削除に失敗しました' }, { status: 500 })
  }
}

