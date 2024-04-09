import React, { useState } from 'react'

const SwitchButton = () => {
    const [active, setActive] = useState(false)
    return (
        <button
            onClick={() => setActive(!active)}
            className={`w-11 h-6 rounded-full transition-all ${active ? 'bg-[#1890FF] pl-[22px]' : 'bg-[#E8E8E8] pl-[2px]'}`}
        >
            <div className="w-5 h-5 rounded-full bg-white"></div>
        </button>
    )
}

export default SwitchButton