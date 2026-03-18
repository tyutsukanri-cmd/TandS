'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type ColorImages = Record<string, { fileName: string; filePath: string }[]>

function useAutoResizeTextArea() {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    resize()
  }, [])

  return { ref, resize }
}

export default function AdminNewProductPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [colorsInput, setColorsInput] = useState('')
  const [sizesInput, setSizesInput] = useState('S,M,L,XL,2XL,3XL')
  const [colorImages, setColorImages] = useState<ColorImages>({})
  const [sizeChart, setSizeChart] = useState<{ fileName: string; filePath: string } | null>(null)
  const [printFront, setPrintFront] = useState<{ fileName: string; filePath: string } | null>(null)
  const [printBack, setPrintBack] = useState<{ fileName: string; filePath: string } | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const descAuto = useAutoResizeTextArea()

  const colors = colorsInput
    .split(/[,，\s]+/)
    .map((c) => c.trim())
    .filter(Boolean)

  const sizes = sizesInput
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const doUploadPng = async (file: File) => {
    setError('')
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      throw new Error('请上传 PNG 格式的图片')
    }

    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const dateFolder = `${y}${m}${d}`

    const form = new FormData()
    form.append('file', file)
    form.append('fileName', file.name)
    form.append('dateFolder', dateFolder)

    const res = await fetch('/api/uploads/png', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || '上传失败')
    }
    return { fileName: data.fileName as string, filePath: data.filePath as string }
  }

  const handleAddColorImage = async (color: string, file: File | null) => {
    if (!file) return
    try {
      const uploaded = await doUploadPng(file)
      setColorImages((prev) => {
        const list = prev[color] ?? []
        return { ...prev, [color]: [...list, uploaded] }
      })
    } catch (e: any) {
      setError(e?.message || '上传失败')
    }
  }

  const handleUploadSingle = async (
    setter: (v: { fileName: string; filePath: string } | null) => void,
    file: File | null
  ) => {
    if (!file) return
    try {
      const uploaded = await doUploadPng(file)
      setter(uploaded)
    } catch (e: any) {
      setError(e?.message || '上传失败')
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('请填写商品名称')
      return
    }
    if (!description.trim()) {
      setError('请填写商品说明')
      return
    }
    if (colors.length === 0) {
      setError('请至少填写一个颜色')
      return
    }
    if (!printFront || !printBack) {
      setError('请上传商品印图展示用的正面图和背面图（PNG）')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        colors,
        sizes,
        colorImages,
        sizeChartUrl: sizeChart?.filePath ?? null,
        printFrontUrl: printFront.filePath,
        printBackUrl: printBack.filePath,
      }
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || '保存失败')
      }
      router.push('/admin/products')
    } catch (e: any) {
      setError(e?.message || '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>添加商品</h1>
          <button type="button" className="btn" onClick={() => router.push('/admin/products')}>
            返回
          </button>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        <div className="card" style={{ maxWidth: '900px' }}>
          <div className="form-group">
            <label>商品名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入商品名称"
            />
          </div>

          <div className="form-group">
            <label>商品说明</label>
            <textarea
              ref={descAuto.ref}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                descAuto.resize()
              }}
              placeholder="请输入商品说明，支持多行内容"
              style={{ minHeight: '80px', resize: 'none', overflow: 'hidden' }}
            />
          </div>

          <div className="form-group">
            <label>颜色（使用逗号分隔，例如：ホワイト, ブラック）</label>
            <input
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              placeholder="请输入颜色列表"
            />
          </div>

          <div className="form-group">
            <label>尺码（使用逗号分隔）</label>
            <input
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
            />
          </div>

          {colors.length > 0 && (
            <div className="form-group">
              <label>各颜色展示图片（可多张，同色多张将每 5 秒轮播）</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colors.map((color) => (
                  <div key={color} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>{color}</div>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        e.target.value = ''
                        handleAddColorImage(color, file)
                      }}
                    />
                    {colorImages[color]?.length ? (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#555' }}>
                        已上传 {colorImages[color].length} 张
                      </div>
                    ) : (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#999' }}>尚未上传图片</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>尺码表图片（PNG）</label>
            <input
              type="file"
              accept="image/png"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                e.target.value = ''
                handleUploadSingle(setSizeChart, file)
              }}
            />
            {sizeChart && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#555' }}>
                已上传：{sizeChart.fileName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>印图展示用 - 正面图（PNG）</label>
            <input
              type="file"
              accept="image/png"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                e.target.value = ''
                handleUploadSingle(setPrintFront, file)
              }}
            />
            {printFront && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#555' }}>
                已上传：{printFront.fileName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>印图展示用 - 背面图（PNG）</label>
            <input
              type="file"
              accept="image/png"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                e.target.value = ''
                handleUploadSingle(setPrintBack, file)
              }}
            />
            {printBack && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#555' }}>
                已上传：{printBack.fileName}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => router.push('/admin/products')}
              disabled={submitting}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              保存
            </button>
          </div>
        </div>
      </div>
  )
}

