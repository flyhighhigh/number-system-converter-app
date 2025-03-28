"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Copy, Trash2, Sun, Moon, Check, Globe, AlertCircle } from 'lucide-react'

export default function NumberSystemConverter() {
  const [binary, setBinary] = useState("")
  const [decimal, setDecimal] = useState("")
  const [hexadecimal, setHexadecimal] = useState("")
  const [customBase, setCustomBase] = useState("")
  const [baseValue, setBaseValue] = useState("8")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isChineseMode, setIsChineseMode] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "" })
  const [errors, setErrors] = useState({
    binary: false,
    decimal: false,
    hexadecimal: false,
    customBase: false
  })

  // Translations
  const translations = {
    en: {
      title: "Number System Converter",
      binary: "Binary",
      decimal: "Decimal",
      hexadecimal: "Hexadecimal",
      customBase: "Custom Base",
      enterBinary: "Enter binary number",
      enterDecimal: "Enter decimal number",
      enterHexadecimal: "Enter hexadecimal number",
      enterCustomBase: (base: string) => `Enter base-${base} number`,
      clearAll: "Clear All",
      copied: (label: string) => `${label} copied to clipboard`,
      invalidBinary: "Invalid binary input (use only 0 and 1)",
      invalidDecimal: "Invalid decimal input (use only 0-9)",
      invalidHexadecimal: "Invalid hexadecimal input (use only 0-9, A-F)",
      invalidCustomBase: (base: string) => `Invalid base-${base} input`
    },
    zh: {
      title: "數字進位轉換器",
      binary: "二進位",
      decimal: "十進位",
      hexadecimal: "十六進位",
      customBase: "自定義進位",
      enterBinary: "輸入二進位數字",
      enterDecimal: "輸入十進位數字",
      enterHexadecimal: "輸入十六進位數字",
      enterCustomBase: (base: string) => `輸入${base}進位數字`,
      clearAll: "清除全部",
      copied: (label: string) => `${label}已複製到剪貼板`,
      invalidBinary: "無效的二進位輸入 (僅使用 0 和 1)",
      invalidDecimal: "無效的十進位輸入 (僅使用 0-9)",
      invalidHexadecimal: "無效的十六進位輸入 (僅使用 0-9, A-F)",
      invalidCustomBase: (base: string) => `無效的${base}進位輸入`
    }
  }

  // Get current language
  const t = isChineseMode ? translations.zh : translations.en

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Validate and convert from decimal to all other bases
  const convertFromDecimal = (decimalValue: string) => {
    // Check if input is a valid decimal number
    if (!decimalValue) {
      // Empty input is valid, just clear other fields
      setBinary("")
      setHexadecimal("")
      setCustomBase("")
      setErrors({...errors, decimal: false})
      return
    }
    
    const isValid = /^[0-9]+$/.test(decimalValue)
    
    if (!isValid) {
      // Invalid decimal input
      setErrors({...errors, decimal: true})
      setBinary("")
      setHexadecimal("")
      setCustomBase("")
      return
    }
    
    // Valid input, clear error and convert
    setErrors({...errors, decimal: false})
    const dec = parseInt(decimalValue)
    setBinary(dec.toString(2))
    setHexadecimal(dec.toString(16).toUpperCase())
    
    // Convert to custom base if valid
    const base = parseInt(baseValue)
    if (base >= 2 && base <= 36) {
      setCustomBase(dec.toString(base).toUpperCase())
    }
  }

  // Validate and convert from binary to all other bases
  const convertFromBinary = (binaryValue: string) => {
    // Check if input is a valid binary number
    if (!binaryValue) {
      // Empty input is valid, just clear other fields
      setDecimal("")
      setHexadecimal("")
      setCustomBase("")
      setErrors({...errors, binary: false})
      return
    }
    
    const isValid = /^[01]+$/.test(binaryValue)
    
    if (!isValid) {
      // Invalid binary input
      setErrors({...errors, binary: true})
      setDecimal("")
      setHexadecimal("")
      setCustomBase("")
      return
    }
    
    // Valid input, clear error and convert
    setErrors({...errors, binary: false})
    const dec = parseInt(binaryValue, 2)
    setDecimal(dec.toString())
    setHexadecimal(dec.toString(16).toUpperCase())
    
    // Convert to custom base if valid
    const base = parseInt(baseValue)
    if (base >= 2 && base <= 36) {
      setCustomBase(dec.toString(base).toUpperCase())
    }
  }

  // Validate and convert from hexadecimal to all other bases
  const convertFromHexadecimal = (hexValue: string) => {
    // Check if input is a valid hexadecimal number
    if (!hexValue) {
      // Empty input is valid, just clear other fields
      setBinary("")
      setDecimal("")
      setCustomBase("")
      setErrors({...errors, hexadecimal: false})
      return
    }
    
    const isValid = /^[0-9A-Fa-f]+$/.test(hexValue)
    
    if (!isValid) {
      // Invalid hexadecimal input
      setErrors({...errors, hexadecimal: true})
      setBinary("")
      setDecimal("")
      setCustomBase("")
      return
    }
    
    // Valid input, clear error and convert
    setErrors({...errors, hexadecimal: false})
    const dec = parseInt(hexValue, 16)
    setBinary(dec.toString(2))
    setDecimal(dec.toString())
    
    // Convert to custom base if valid
    const base = parseInt(baseValue)
    if (base >= 2 && base <= 36) {
      setCustomBase(dec.toString(base).toUpperCase())
    }
  }

  // Validate and convert from custom base to all other bases
  const convertFromCustomBase = (customValue: string, base: string) => {
    const baseInt = parseInt(base)
    
    // Check if input is empty
    if (!customValue) {
      // Empty input is valid, just clear other fields
      setBinary("")
      setDecimal("")
      setHexadecimal("")
      setErrors({...errors, customBase: false})
      return
    }
    
    // Check if base is valid
    if (baseInt < 2 || baseInt > 36) {
      return
    }
    
    // Create a regex pattern based on the base
    let pattern = '^[0-9'
    if (baseInt > 10) {
      // Add A-Z characters as needed for the base
      const lastChar = String.fromCharCode(65 + (baseInt - 11))
      pattern += `A-${lastChar}a-${lastChar.toLowerCase()}`
    }
    pattern += ']+$'
    
    const regex = new RegExp(pattern)
    const isValid = regex.test(customValue)
    
    if (!isValid) {
      // Invalid custom base input
      setErrors({...errors, customBase: true})
      setBinary("")
      setDecimal("")
      setHexadecimal("")
      return
    }
    
    // Valid input, clear error and convert
    setErrors({...errors, customBase: false})
    try {
      const dec = parseInt(customValue, baseInt)
      setBinary(dec.toString(2))
      setDecimal(dec.toString())
      setHexadecimal(dec.toString(16).toUpperCase())
    } catch (e) {
      // Handle parsing errors
      setErrors({...errors, customBase: true})
      setBinary("")
      setDecimal("")
      setHexadecimal("")
    }
  }

  // Handle base value change
  useEffect(() => {
    if (customBase && !errors.customBase) {
      convertFromCustomBase(customBase, baseValue)
    }
  }, [baseValue])

  // Copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      const translatedLabel = isChineseMode ? 
        (label === "Binary" ? "二進制" : 
         label === "Decimal" ? "十進制" : 
         label === "Hexadecimal" ? "十六進制" : 
         `${baseValue}進制`) : label;
      
      setNotification({ show: true, message: t.copied(translatedLabel) })
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "" })
      }, 2000)
    })
  }

  // Clear all values and errors
  const clearAll = () => {
    setBinary("")
    setDecimal("")
    setHexadecimal("")
    setCustomBase("")
    setErrors({
      binary: false,
      decimal: false,
      hexadecimal: false,
      customBase: false
    })
  }

  // Open GitHub profile
  const openGitHub = () => {
    window.open("https://github.com/flyhighhigh", "_blank", "noopener,noreferrer")
  }

  // Update translations when language changes
  useEffect(() => {
    // Re-validate inputs when language changes to update error messages
    if (errors.binary && binary) {
      convertFromBinary(binary)
    }
    if (errors.decimal && decimal) {
      convertFromDecimal(decimal)
    }
    if (errors.hexadecimal && hexadecimal) {
      convertFromHexadecimal(hexadecimal)
    }
    if (errors.customBase && customBase) {
      convertFromCustomBase(customBase, baseValue)
    }
  }, [isChineseMode])

  return (
    <div className="relative min-h-screen p-4 transition-colors ">
      {/* Simple notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md flex items-center gap-2">
          <Check className="h-4 w-4" />
          {notification.message}
        </div>
      )}
      
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-8">
        {/* Brand button */}
        <Button 
          variant="outline" 
          className="font-semibold text-primary"
          onClick={openGitHub}
        >
          <img 
            src="./favicon.ico" 
            alt="Logo" 
            className="h-6" // 这里调整 logo 的大小
          />
          flyhighhigh
        </Button>
        
        {/* Control buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsChineseMode(!isChineseMode)}
            title={isChineseMode ? "Switch to English" : "切換到中文"}
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isChineseMode ? "切換暗/亮模式" : "Toggle dark/light mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <Card className="w-full max-w-md mx-auto duration-500">
        <CardHeader>
          <CardTitle className="tracking-tight text-2xl font-bold text-center">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="binary" className={`dark:text-gray-200 ${errors.binary ? 'text-red-500 dark:text-red-400' : ''}`}>
              {t.binary}
            </Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="binary"
                  placeholder={t.enterBinary}
                  value={binary}
                  onChange={(e) => {
                    setBinary(e.target.value)
                    convertFromBinary(e.target.value)
                  }}
                  className={`mono-font ${
                    errors.binary ? 'border-red-500 dark:border-red-400' : ''
                  }`}
                />
                {errors.binary && (
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(binary, "Binary")}
                className="dark:hover:bg-gray-700"
                disabled={errors.binary}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimal" className={`dark:text-gray-200 ${errors.decimal ? 'text-red-500 dark:text-red-400' : ''}`}>
              {t.decimal}
            </Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="decimal"
                  placeholder={t.enterDecimal}
                  value={decimal}
                  onChange={(e) => {
                    setDecimal(e.target.value)
                    convertFromDecimal(e.target.value)
                  }}
                  className={`mono-font ${
                    errors.decimal ? 'border-red-500 dark:border-red-400' : ''
                  }`}
                />
                {errors.decimal && (
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(decimal, "Decimal")}
                className="dark:hover:bg-gray-700"
                disabled={errors.decimal}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hexadecimal" className={`dark:text-gray-200 ${errors.hexadecimal ? 'text-red-500 dark:text-red-400' : ''}`}>
              {t.hexadecimal}
            </Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="hexadecimal"
                  placeholder={t.enterHexadecimal}
                  value={hexadecimal}
                  onChange={(e) => {
                    setHexadecimal(e.target.value)
                    convertFromHexadecimal(e.target.value)
                  }}
                  className={`mono-font ${
                    errors.hexadecimal ? 'border-red-500 dark:border-red-400' : ''
                  }`}
                />
                {errors.hexadecimal && (
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(hexadecimal, "Hexadecimal")}
                className="dark:hover:bg-gray-700"
                disabled={errors.hexadecimal}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label 
                htmlFor="customBase" 
                className={`dark:text-gray-200 ${errors.customBase ? 'text-red-500 dark:text-red-400' : ''}`}
              >
                {t.customBase}
              </Label>
              <Input
                id="baseValue"
                type="number"
                min="2"
                max="36"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
                className="w-20 mono-font"
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="customBase"
                  placeholder={t.enterCustomBase(baseValue)}
                  value={customBase}
                  onChange={(e) => {
                    setCustomBase(e.target.value)
                    convertFromCustomBase(e.target.value, baseValue)
                  }}
                  className={`mono-font ${
                    errors.customBase ? 'border-red-500 dark:border-red-400' : ''
                  }`}
                />
                {errors.customBase && (
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(customBase, `Base-${baseValue}`)}
                className="dark:hover:bg-gray-700"
                disabled={errors.customBase}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full mt-4"
            onClick={clearAll}
          >
            <Trash2 className="h-4 w-4" /> {t.clearAll} <div className="w-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}