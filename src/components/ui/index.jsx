import React from 'react';
// import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';


// Button Component
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


export const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

// Select Component
export const Select = ({
  children,
  value = '',
  onChange,
  className = '',
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// Modal Component
// export const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md',
//   ...props
// }) => {
//   const sizeClasses = {
//     sm: 'max-w-sm',
//     md: 'max-w-md',
//     lg: 'max-w-lg',
//     xl: 'max-w-xl',
//     '2xl': 'max-w-2xl',
//     full: 'max-w-full',
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
//         <div className="min-h-screen px-4 text-center">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
//           </Transition.Child>

//           {/* This element is to trick the browser into centering the modal contents. */}
//           <span className="inline-block h-screen align-middle" aria-hidden="true">
//             &#8203;
//           </span>

//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <div className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
//               {title && (
//                 <Dialog.Title
//                   as="h3"
//                   className="text-lg font-medium leading-6 text-gray-900 mb-4"
//                 >
//                   {title}
//                 </Dialog.Title>
//               )}
              
//               <div className="mt-2">
//                 {children}
//               </div>
//             </div>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };




export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          {title && (
            <div className="border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          
          {/* Modal content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};