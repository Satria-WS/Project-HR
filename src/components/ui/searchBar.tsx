import { Search } from 'lucide-react'
import React from 'react'

const searchBar = () => {
  return (
    <div className="flex-1 min-w-0 px-4 md:px-8">
    <div className="relative">
      <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
      <input
        type="text"
        placeholder="Search projects, tasks, or team members..."
        className="w-full py-2 pl-10 pr-3 text-sm leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
  )
}

export default searchBar