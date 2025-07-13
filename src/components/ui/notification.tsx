import { Bell } from 'lucide-react'
import React from 'react'

const notification = () => {
  return (
    <div className="relative">
    <button 
      className="p-2 text-gray-500 hover:text-gray-600"
      onClick={() => console.log('notification')}
    >
      <Bell className="w-6 h-6" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
  </div>
  )
}

export default notification