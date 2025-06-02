"use client"
import { useState, useRef } from "react"
import { Upload, Brain, Zap, Target, X, Sparkles, Camera, ChevronRight, Star } from "lucide-react"

const models = [
  {
    id: "1",
    name: "Model 1",
    description: "Model yang menggunakan global max pooling, lapisan dense 64, dropout 0.2, dan learning rate 0.001",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
  },
  {
    id: "2",
    name: "Model 2",
    description: "Model yang menggunakan global average pooling, lapisan dense 128, dropout 0.3, dan learning rate 0.001",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "3",
    name: "Model 3",
    description: "Model yang menggunakan global average pooling, lapisan dense 128 & 64, dropout 0.4, dan learning rate 0.0001",
    icon: Target,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-r from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
  },
]


export default function ImageClassifier() {
  const [selectedModel, setSelectedModel] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [results, setResults] = useState(null)
  // Tambahkan state baru untuk menyimpan model yang digunakan saat klasifikasi
  const [usedModelId, setUsedModelId] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result)
        setResults(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClassify = async () => {
    if (!uploadedImage || !selectedModel) return

    setIsClassifying(true)
    setResults(null)
    // Simpan model yang digunakan saat klasifikasi
    setUsedModelId(selectedModel)

    try {
      // Mengekstrak file dari base64 URL
      const base64Response = await fetch(uploadedImage)
      const blob = await base64Response.blob()
      
      // Membuat FormData untuk mengirim file
      const formData = new FormData()
      formData.append('image', blob, 'image.jpg')
      formData.append('model_id', selectedModel)
      
      // Kirim request ke backend Flask
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Gagal melakukan klasifikasi')
      }
      
      const data = await response.json()
      
      // Format hasil untuk ditampilkan di UI
      const predictedClass = data.class_name
      const confidence = data.confidence
      
      // Buat array hasil dengan kelas yang diprediksi dan beberapa kelas lain dengan confidence lebih rendah
      const formattedResults = [
        { label: predictedClass, confidence: confidence },
      ]
      
     
      
      setResults(formattedResults)
    } catch (error) {
      console.error('Error classifying image:', error)
      alert('Terjadi kesalahan saat mengklasifikasi gambar. Silakan coba lagi.')
    } finally {
      setIsClassifying(false)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const selectedModelData = models.find((m) => m.id === selectedModel)
  // Tambahkan ini untuk mendapatkan data model yang digunakan saat klasifikasi
  const usedModelData = models.find((m) => m.id === usedModelId)

  // Custom Badge component
  const Badge = ({ children, variant, className }) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    const variantClasses = variant === "default" ? "bg-black text-white" : "bg-gray-100 text-gray-800"

    return <span className={`${baseClasses} ${variantClasses} ${className || ""}`}>{children}</span>
  }

  // Custom Progress component
  const Progress = ({ value, className }) => {
    return (
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className || ""}`}>
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Created by Kelompok 11</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold pb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              PC Parts Image Classification
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sistem klasifikasi gambar berbasis AI untuk mengenali dan mengelompokkan komponen PC secara otomatis, dengan{" "}
              <span className="font-semibold text-blue-600">akurasi tinggi</span> dan{" "}
              <span className="font-semibold text-purple-600">performa optimal</span>
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Left Column - Model Selection */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 text-xl font-semibold mb-1">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    Pilih Model AI
                  </div>
                  <p className="text-gray-600 text-sm">Pilih model yang sesuai dengan kebutuhan klasifikasi Anda</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="grid gap-3">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedModel === model.id
                            ? `${model.bgColor} ${model.borderColor} shadow-lg`
                            : "bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white/80"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${model.color} ${
                              selectedModel === model.id ? "shadow-lg" : ""
                            }`}
                          >
                            <model.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{model.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{model.description}</p>
                          </div>
                          {selectedModel === model.id && (
                            <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Image Upload */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 text-xl font-semibold mb-1">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    Upload Gambar
                  </div>
                  <p className="text-gray-600 text-sm">
                    Upload gambar berkualitas tinggi untuk hasil klasifikasi terbaik
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {!uploadedImage ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">Klik untuk upload gambar</p>
                          <p className="text-sm text-gray-500">atau drag & drop file di sini</p>
                          <p className="text-xs text-gray-400 mt-2">Mendukung JPG, PNG, WebP • Maksimal 10MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded image"
                            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <button
                          onClick={clearImage}
                          className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 shadow-lg hover:scale-110 transition-transform duration-200 bg-red-500 text-white flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleClassify}
                      disabled={!uploadedImage || !selectedModel || isClassifying}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                    >
                      {isClassifying ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Menganalisis...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Klasifikasi Gambar
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-lg overflow-hidden h-fit">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 text-xl font-semibold mb-1">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    Hasil Klasifikasi
                  </div>
                  <p className="text-gray-600 text-sm">Hasil prediksi model AI dengan tingkat confidence</p>
                </div>
                <div className="p-6 pt-0">
                  {isClassifying && (
                    <div className="space-y-6 py-8">
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin">
                            <div className="absolute inset-2 rounded-full bg-white"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Menganalisis Gambar</h3>
                        <p className="text-gray-600">AI sedang memproses gambar Anda...</p>
                      </div>
                      <div className="space-y-2">
                        <Progress value={33} className="h-2" />
                        <p className="text-sm text-gray-500 text-center">Menggunakan model {selectedModelData?.name}</p>
                      </div>
                    </div>
                  )}

                  {results && !isClassifying && (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Klasifikasi Berhasil!</h3>
                        <p className="text-sm text-green-700">
                          {usedModelData?.name} telah menganalisis gambar Anda
                        </p>
                      </div>

                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                              index === 0
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md"
                                : "bg-gray-50/80 border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                {index === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                                <span className={`font-semibold ${index === 0 ? "text-blue-900" : "text-gray-800"}`}>
                                  {result.label}
                                </span>
                              </div>
                              <Badge
                                variant={index === 0 ? "default" : "secondary"}
                                className={index === 0 ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                              >
                                {(result.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <Progress
                              value={result.confidence * 100}
                              className={`h-3 ${index === 0 ? "bg-blue-100" : "bg-gray-200"}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">Prediksi Teratas</p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{results[0].label}</span> dengan tingkat confidence{" "}
                              <span className="font-semibold text-blue-600">
                                {(results[0].confidence * 100).toFixed(1)}%
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!uploadedImage && !isClassifying && !results && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Siap untuk Klasifikasi</h3>
                      <p className="text-gray-500 leading-relaxed">
                        Upload gambar dan pilih model untuk melihat hasil klasifikasi AI yang akurat
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Created by Kelompok 11 • Fausta Akbar, Andre Aditya, Briyant Jonathan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
