import React from 'react';
import { 
  Plus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function Team() {
  const team = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Designer',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 2,
      name: 'Mike Johnson',
      role: 'Frontend Developer',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 3,
      name: 'Alex Kim',
      role: 'Project Manager',
      email: 'alex.kim@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Seattle, WA',
      imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Team Members
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Member
          </button>
        </div>
      </div>

      <ul role="list" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((person) => (
          <li
            key={person.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">{person.name}</h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {person.role}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    {person.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    {person.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    {person.location}
                  </div>
                </div>
              </div>
              <img className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300" src={person.imageUrl} alt="" />
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <button
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    Message
                  </button>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <button
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}