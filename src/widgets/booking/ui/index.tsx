"use client"

import React, { useState } from 'react'
import { steps, StepId } from '../lib/data'
import ParticipantsStep from './ParticipantsStep'
import TourInfoStep from './TourInfoStep'
import ServicesStep from './ServicesStep'
import PaymentStep from './PaymentStep'
import TimeStep from './TimeStep'

export default function Booking() {
  const [activeStep, setActiveStep] = useState<StepId>('time')

  return (
    <section className={'bg-[#EDEEF1] min-h-[70vh] ' + (activeStep === 'participants' ? 'h-[calc(100vh-16px)]' : '')}>
      <div className='custom-container py-[16px]'>
        <div className='flex items-center gap-[10px]'>
          <p className='text-[#646465]'>Главная страница</p>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.9105 7.74412C8.58506 8.06955 8.58506 8.59719 8.9105 8.92263C9.23594 9.24807 9.76358 9.24807 10.089 8.92263L13.4223 5.5893C13.7478 5.26386 13.7478 4.73622 13.4223 4.41079L10.089 1.07745C9.76358 0.752015 9.23594 0.752015 8.9105 1.07745C8.58506 1.40289 8.58506 1.93053 8.9105 2.25596L10.8212 4.16671H1.16634C0.706103 4.16671 0.333008 4.5398 0.333008 5.00004C0.333008 5.46028 0.706103 5.83337 1.16634 5.83337H10.8212L8.9105 7.74412Z" fill="#646465" />
          </svg>
          <p className='text-[#646465]'>Подобрать тур</p>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9105 12.7441C11.5851 13.0696 11.5851 13.5972 11.9105 13.9226C12.2359 14.2481 12.7636 14.2481 13.089 13.9226L16.4223 10.5893C16.7478 10.2639 16.7478 9.73622 16.4223 9.41079L13.089 6.07745C12.7636 5.75201 12.2359 5.75201 11.9105 6.07745C11.5851 6.40289 11.5851 6.93053 11.9105 7.25596L13.8212 9.16671H4.16634C3.7061 9.16671 3.33301 9.5398 3.33301 10C3.33301 10.4603 3.7061 10.8334 4.16634 10.8334H13.8212L11.9105 12.7441Z" fill="#646465" />
          </svg>
          <p className='text-[#646465]'>Забронировать</p>
        </div>

        <div className='flex items-center gap-[16px] mt-[20px]'>
          <div className='w-[40px] h-[40px] cursor-pointer border-2 border-[#DFDFDF] rounded-full flex items-center justify-center'>
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.08711 8.825L3.27044 5L7.08711 1.175L5.91211 0L0.912109 5L5.91211 10L7.08711 8.825Z" fill="#031753" />
            </svg>
          </div>
          <h1 className='text-[#031753] text-[32px] font-bold'>
            Забронировать
          </h1>
        </div>

        <div className='grid grid-cols-[280px_minmax(0,1fr)] items-start gap-[16px] mt-[20px]'>
          <div className='relative flex flex-col h-max items-stretch gap-2 w-full p-[12px] border-2 rounded-[20px] bg-[#FFFFFF]'>
            {/* continuous vertical dashed line aligned to circle center */}
            <span aria-hidden className='pointer-events-none absolute right-[42px] top-3 bottom-3 border-r border-dashed border-[#909091] z-10' />
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = activeStep === step.id
              const activeIndex = steps.findIndex(s => s.id === activeStep)
              const stepIndex = steps.findIndex(s => s.id === step.id)
              const isCompleted = stepIndex < activeIndex
              return (
                <button
                  key={step.id}
                  type='button'
                  onClick={() => setActiveStep(step.id)}
                  aria-current={isActive}
                  className={`relative w-full cursor-pointer flex items-center justify-between p-[12px] rounded-[8px] transition-colors ${isActive ? 'bg-[#084FE3] text-white' : 'bg-white text-black hover:bg-[#F5F6F8]'}`}
                >
                  <span className='flex items-center gap-[10px]'>
                    <Icon />
                    <span className='font-medium'>{step.name}</span>
                  </span>
                  <span className='absolute right-5 top-1/2 -translate-y-1/2 z-20'>
                    {/* Indicator circle */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke={isActive || isCompleted ? '#084FE3' : '#909091'} />
                      {isActive && (
                        <rect x="4" y="4" width="12" height="12" rx="6" fill={'white'} />
                      )}
                      {isCompleted && (
                        <rect x="4" y="4" width="12" height="12" rx="6" fill={'#084FE3'} />
                      )}
                    </svg>
                  </span>
                </button>
              )
            })}
          </div>

          <div className='min-w-0'>
            {activeStep === 'time' && (
              <TimeStep onNext={() => setActiveStep('participants')} />
            )}
            {activeStep === 'participants' && (
              <ParticipantsStep onNext={() => setActiveStep('package')} />
            )}
            {activeStep === "package" && (
              <TourInfoStep onNext={() => setActiveStep('services')} />
            )}
            {activeStep === "services" && (
              <ServicesStep onNext={() => setActiveStep('payment')} />
            )}
            {activeStep === "payment" && (
              <PaymentStep onNext={() => setActiveStep('payment')} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
