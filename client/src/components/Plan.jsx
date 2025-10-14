import React from 'react'
import { PricingTable } from '@clerk/clerk-react'
function Plan() {
    return (
        <div class="max-w-2xl mx-auto z-20 my-30">
            <div class="text-center">
                <h2 class="text-slate-700 text-[42px] font-semibold">
                    Choose Your Plan
                </h2>
                <p class="text-gray-500 max-w-lg mx-auto">
                    Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
                </p>
            </div>
            <div className='mt-14 max-sm:mx-8'>
                <PricingTable/>
            </div>
        </div>

    )
}

export default Plan