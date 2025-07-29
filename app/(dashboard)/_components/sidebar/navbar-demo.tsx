'use client';

import { useState } from "react";
import MobileNavbar from "./mobile-navbar-variants";

type NavbarVariant = 'circle' | 'partial-fill' | 'underline' | 'dash' | 'pill';

const NavbarDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState<NavbarVariant>('underline');

  const variants: { key: NavbarVariant; label: string; description: string }[] = [
    {
      key: 'circle',
      label: 'Circle Background',
      description: 'Active icon has a circular background highlight'
    },
    {
      key: 'partial-fill',
      label: 'Partial Fill',
      description: 'Active icon has a subtle fill effect'
    },
    {
      key: 'underline',
      label: 'Underline',
      description: 'Active item has an underline below the text'
    },
    {
      key: 'dash',
      label: 'Small Dash',
      description: 'Active item has a small dash below the icon'
    },
    {
      key: 'pill',
      label: 'Pill Background',
      description: 'Active item has a pill-shaped background'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Mobile Navigation Bar Variants</h2>
        <p className="text-gray-600">Choose your preferred mobile navigation style</p>
      </div>

      {/* Variant Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <button
            key={variant.key}
            onClick={() => setSelectedVariant(variant.key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedVariant === variant.key
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold mb-1">{variant.label}</h3>
            <p className="text-sm text-gray-600">{variant.description}</p>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Preview - {variants.find(v => v.key === selectedVariant)?.label}</h3>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
          {/* Simulated mobile screen */}
          <div className="h-96 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Mobile App Content</p>
          </div>
          
          {/* Mobile navbar preview */}
          <div className="bg-white border-t border-gray-200">
            <div className="flex items-center justify-around px-2 py-3">
              {['Dashboard', 'Token', 'Feedback', 'Analysis', 'Settings'].map((item, index) => (
                <div
                  key={item}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 relative min-w-0 flex-1 ${
                    index === 0 ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  <div className="relative mb-1">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    {index === 0 && selectedVariant === 'circle' && (
                      <div className="absolute -inset-2 bg-orange-100 rounded-full opacity-60" />
                    )}
                    {index === 0 && selectedVariant === 'partial-fill' && (
                      <div className="absolute inset-0 bg-orange-500 rounded-sm opacity-30" />
                    )}
                    {index === 0 && selectedVariant === 'underline' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                    )}
                    {index === 0 && selectedVariant === 'dash' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-orange-500 rounded-full" />
                    )}
                    {index === 0 && selectedVariant === 'pill' && (
                      <div className="absolute inset-0 bg-orange-50 rounded-lg -z-10" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Code:</h3>
        <pre className="text-sm overflow-x-auto">
{`<MobileNavbar variant="${selectedVariant}" />`}
        </pre>
      </div>
    </div>
  );
};

export default NavbarDemo; 