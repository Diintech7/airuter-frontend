"use client"

const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled = false }) => {
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
  ]

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Select Interview Language / साक्षात्कार की भाषा चुनें
      </label>
      <div className="grid grid-cols-2 gap-4">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            disabled={disabled}
            className={`p-1 rounded-lg border-2 transition-all duration-200 ${
              selectedLanguage === language.code
                ? "border-blue-500 bg-blue-500 bg-opacity-20 text-blue-300"
                : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSelector
