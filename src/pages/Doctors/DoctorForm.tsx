import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Doctor } from '../../types'
import { useStore } from '../../store/useStore'

type FormValues = Omit<Doctor, 'id'>

const DoctorForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const addDoctor = useStore((s) => s.addDoctor)
  const navigate = useNavigate()

  const onSubmit = (data: FormValues) => {
    const newDoctor: Doctor = { ...data, id: uuidv4() }
    addDoctor(newDoctor)
    navigate('/doctors')
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-4 md:mb-6">Add Doctor</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter doctor's name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              {...register('specialization', { required: 'Specialization is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Cardiology, Pediatrics"
            />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
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
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition"
            >
              Create Doctor
            </button>
            <button
              type="button"
              onClick={() => navigate('/doctors')}
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

export default DoctorForm
