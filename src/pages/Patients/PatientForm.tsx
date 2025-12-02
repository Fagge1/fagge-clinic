import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Patient } from '../../types'
import { useStore } from '../../store/useStore'

type FormValues = Omit<Patient, 'id' | 'createdAt'>

const PatientForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const addPatient = useStore((s) => s.addPatient)
  const navigate = useNavigate()

  const onSubmit = (data: FormValues) => {
    const newPatient: Patient = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    addPatient(newPatient)
    navigate('/patients')
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-4 md:mb-6">New Patient</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Main Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('emergencyContact.name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Contact name"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  {...register('emergencyContact.phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Contact phone"
                />
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-3">Medical History</h3>
            <textarea
              {...register('medicalHistory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={4}
              placeholder="Any allergies, chronic conditions, or past surgeries?"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition"
            >
              Create Patient
            </button>
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientForm
