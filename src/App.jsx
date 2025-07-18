import { useRef, useState } from "react"
import axios from "axios"
import {useLocalStorage} from './hooks/useLocalStorage.js'

// const API_URL = "https://9c0c1d0e9a2d.ngrok-free.app"

function App() {
  const webcamRef = useRef(null)
  const [useCam, setUseCam] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL, setVideoURL] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleDetect = async () => {
    if (!imageFile) {
      alert("Primero selecciona o captura una imagen")
      return
    }
    const formData = new FormData()
    formData.append("file", imageFile)
    setLoading(true)
    try {
      const response = await axios.post(`${handleGet()}/detectar/`, formData)
      setResult(response.data)
    } catch (err) {
      alert("❌ Error al conectar con la API.")
    }
    setLoading(false)
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    setVideoFile(file)
  }

  const handleUploadVideo = async () => {
    if (!videoFile) {
      alert("Selecciona un video")
      return
    }
    const formData = new FormData()
    formData.append("file", videoFile)
    try {
      const res = await axios.post(`${handleGet()}/video_upload/`, formData)
      setVideoURL(res.data.url)
    } catch (err) {
      alert("❌ Error al subir el video")
    }
  }

  const handleCloseCamera = () => {
    setUseCam(false)
  }

  const handleClearPreview = () => {
    setPreview(null)
    setResult(null)
  }

  const handleClearVideo = () => {
    setVideoFile(null)
    setVideoURL(null)
  }

  const { storedValue, setStorage, getStorage } = useLocalStorage('myKey');
  const [input, setInput] = useState(storedValue);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSave = () => {
    setStorage(input);
  };

  const handleGet = () => {
    const value = getStorage();
    // alert('Stored Value: ' + (value || 'Nada guardado'));
    return value || 'Nada guardado';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
            🧠 Detección de Objetos En Oficina
          </h1>
          <p className="text-gray-400 text-lg">....</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Seleccionar Modo</h2>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  onClick={() => setUseCam(false)}
                >
                  📂 Subir Imagen
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  onClick={() => setUseCam(true)}
                >
                  📸 Usar Cámara
                </button>
              </div>
            </div>

            {/* File Upload or Camera */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              {!useCam ? (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-200">Cargar Imagen</h3>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-cyan-600 file:to-cyan-700 file:text-white hover:file:from-cyan-700 hover:file:to-cyan-800 file:cursor-pointer file:transition-all file:duration-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-gray-200">📺 Detección en vivo desde cámara</h3>
                  <div className="relative inline-block">
                    <img
                      src={`${handleGet()}/video_feed?source=cam`}
                      alt="Stream de cámara"
                      className="w-full max-w-md h-auto rounded-xl border-2 border-gray-600 shadow-2xl"
                    />
                  </div>
                  <button
                    className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleCloseCamera}
                  >
                    ❌ Cerrar Cámara
                  </button>
                </div>
              )}
            </div>

            {/* Detect Button */}
            <div className="text-center">
              <button
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleDetect}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Detectando...
                  </div>
                ) : (
                  "🔍 Detectar Objetos"
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Preview and Results */}
          <div className="space-y-6">
            {/* Image Preview */}
            {preview && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-200">🖼 Vista previa</h3>
                  <button
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                    onClick={handleClearPreview}
                  >
                    ❌ Cerrar
                  </button>
                </div>
                <div className="text-center">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="preview"
                    className="max-w-full h-auto rounded-xl border-2 border-gray-600 shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Detection Results */}
            {result && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">📦 Objetos Detectados</h2>
                <div className="text-center mb-4">
                  <img
                    src={`data:image/jpeg;base64,${result.image}`}
                    alt="resultado"
                    className="max-w-full h-auto rounded-xl border-2 border-gray-600 shadow-lg mx-auto"
                  />
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <h3 className="font-medium mb-3 text-gray-300">Conteo de objetos:</h3>
                  <ul className="space-y-2">
                    {Object.entries(result.conteo).map(([clase, cantidad]) => (
                      <li key={clase} className="flex justify-between items-center bg-gray-700/30 rounded-lg px-4 py-2">
                        <span className="text-gray-300 capitalize">{clase}</span>
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🎥 Detección desde Video
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Video Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-200">Cargar Video</h3>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-orange-600 file:to-red-600 file:text-white hover:file:from-orange-700 hover:file:to-red-700 file:cursor-pointer file:transition-all file:duration-300"
                  />
                  <button
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                    onClick={handleUploadVideo}
                  >
                    🔄 Subir y Procesar Video
                  </button>
                </div>
              </div>

              {/* Video Result */}
              {videoURL && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-200">🎬 Video procesado</h3>
                    <button
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                      onClick={handleClearVideo}
                    >
                      ❌ Cerrar
                    </button>
                  </div>
                  <div className="text-center">
                    <img
                      src={videoURL || "/placeholder.svg"}
                      alt="Video procesado"
                      className="w-full h-auto rounded-xl border-2 border-gray-600 shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Escribe algo"
        className="border p-2 mr-2"
      />
      <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 mr-2">
        Guardar
      </button>
      <button onClick={handleGet} className="bg-green-500 text-white px-2 py-1">
        Obtener
      </button>
      <div className="mt-2 text-gray-700">Valor actual: {storedValue}</div>
    </div>
    </div>
  );
}

export default App