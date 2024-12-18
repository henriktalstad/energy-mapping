import { Loader2 } from 'lucide-react'

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mb-4" />
        <h2 className="text-2xl font-semibold text-emerald-800 mb-2">Laster inn...</h2>
        <p className="text-emerald-600">Vennligst vent mens vi forbereder ditt prosjekt</p>
      </div>
      <div className="mt-8">
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 bg-emerald-600 rounded-full animate-bounce`}
              style={{ animationDelay: `${index * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

