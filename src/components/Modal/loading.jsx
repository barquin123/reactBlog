import React from 'react'

 const Loading = () => {
  return (
    <div className="modalContainer fixed w-full h-screen z-20 left-0">
        <div className="modalContent absolute top-1/2 -translate-x-1/2 left-1/2">
            <div className="modalInner top-1/2 -translate-x-1/2 left-1/2">
            <span className="loader"></span>
            </div>
        </div>
    </div>
  )
}

export default Loading;
