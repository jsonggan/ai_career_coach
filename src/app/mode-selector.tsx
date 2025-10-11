"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { setUserMode } from "./actions";

interface ModeSelectorProps {
  currentMode: 'student' | 'working-professional';
  isCollapsed: boolean;
}

export function ModeSelector({ currentMode, isCollapsed }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleModeChange = (mode: 'student' | 'working-professional') => {
    if (mode !== currentMode) {
      startTransition(async () => {
        await setUserMode(mode);
        setIsOpen(false);
      });
    } else {
      setIsOpen(false);
    }
  };

  const modes = [
    { 
      key: 'student' as const, 
      label: 'Student', 
      icon: 'pi pi-graduation-cap',
      description: 'Learning & Development'
    },
    { 
      key: 'working-professional' as const, 
      label: 'Working Professional', 
      icon: 'pi pi-briefcase',
      description: 'Career Advancement'
    },
  ];

  const currentModeData = modes.find(m => m.key === currentMode) || modes[0];

  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center",
            isPending && "opacity-50"
          )}
          title={currentModeData.label}
          disabled={isPending}
        >
          <i className={clsx(currentModeData.icon, "text-blue-600")} />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-full top-0 ml-2 z-20 bg-white border border-gray-200 rounded-md shadow-lg min-w-[200px]">
              {modes.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => handleModeChange(mode.key)}
                  className={clsx(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 first:rounded-t-md last:rounded-b-md",
                    currentMode === mode.key && "bg-blue-50 text-blue-700"
                  )}
                >
                  <i className={clsx(mode.icon, currentMode === mode.key ? "text-blue-600" : "text-gray-400")} />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{mode.label}</span>
                    <span className="text-xs text-gray-500">{mode.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-3 justify-between",
          isPending && "opacity-50"
        )}
        disabled={isPending}
      >
        <div className="flex items-center gap-3">
          <i className={clsx(currentModeData.icon, "text-blue-600")} />
          <div className="flex flex-col text-left">
            <span className="font-medium text-sm">{currentModeData.label}</span>
            <span className="text-xs text-gray-500">{currentModeData.description}</span>
          </div>
        </div>
        <i className={clsx(
          "pi pi-chevron-down text-gray-400 text-xs transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border border-gray-200 rounded-md shadow-lg">
            {modes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => handleModeChange(mode.key)}
                className={clsx(
                  "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 first:rounded-t-md last:rounded-b-md",
                  currentMode === mode.key && "bg-blue-50 text-blue-700"
                )}
              >
                <i className={clsx(mode.icon, currentMode === mode.key ? "text-blue-600" : "text-gray-400")} />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{mode.label}</span>
                  <span className="text-xs text-gray-500">{mode.description}</span>
                </div>
                {currentMode === mode.key && (
                  <i className="pi pi-check text-blue-600 text-xs ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
