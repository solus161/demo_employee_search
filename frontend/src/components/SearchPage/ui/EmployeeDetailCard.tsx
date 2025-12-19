import { BsEnvelope, BsTelephone, BsGeoAlt, BsBuilding, BsPerson } from 'react-icons/bs'

interface EmployeeDetailCardProps {
  employee: {
    id: string
    name: string
    email: string
    phone?: string
    department?: string
    position?: string
    location?: string
    city?: string
    state?: string
    photoUrl?: string
    hireDate?: string
    manager?: string
  } | null
}

export const EmployeeDetailCard = ({ employee }: EmployeeDetailCardProps) => {
  if (!employee) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <BsPerson className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Select an employee to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with photo */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex flex-col items-center">
          {employee.photoUrl ? (
            <img
              src={employee.photoUrl}
              alt={employee.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              <BsPerson className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <h3 className="mt-4 text-xl font-semibold text-white">{employee.name}</h3>
          {employee.position && (
            <p className="mt-1 text-sm text-blue-100">{employee.position}</p>
          )}
        </div>
      </div>

      {/* Employee details */}
      <div className="p-6 space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <BsEnvelope className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Email
            </p>
            <a
              href={`mailto:${employee.email}`}
              className="text-sm text-blue-600 hover:text-blue-700 break-all"
            >
              {employee.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        {employee.phone && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <BsTelephone className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Phone
              </p>
              <a
                href={`tel:${employee.phone}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {employee.phone}
              </a>
            </div>
          </div>
        )}

        {/* Department */}
        {employee.department && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <BsBuilding className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Department
              </p>
              <p className="text-sm text-gray-900">{employee.department}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {(employee.location || employee.city || employee.state) && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <BsGeoAlt className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-sm text-gray-900">
                {employee.location && <span>{employee.location}</span>}
                {(employee.city || employee.state) && (
                  <span>
                    {employee.location && <br />}
                    {employee.city}
                    {employee.city && employee.state && ', '}
                    {employee.state}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        {(employee.hireDate || employee.manager) && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {/* Hire Date */}
            {employee.hireDate && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Hire Date
                </p>
                <p className="text-sm text-gray-900">{employee.hireDate}</p>
              </div>
            )}

            {/* Manager */}
            {employee.manager && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Reports To
                </p>
                <p className="text-sm text-gray-900">{employee.manager}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
          Edit Details
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          View Full Profile
        </button>
      </div>
    </div>
  )
}
