import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  disabled?: boolean;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEscape,
    onTab,
    disabled = false
  } = options;

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 기본 동작 유지
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case ' ':
        case 'Space':
          if (onSpace) {
            event.preventDefault();
            onSpace();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Tab':
          if (onTab) {
            onTab();
          }
          break;
      }
    };

    if (elementRef.current) {
      elementRef.current.addEventListener('keydown', handleKeyDown);
      return () => {
        elementRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [onEnter, onSpace, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEscape, onTab, disabled]);

  return elementRef;
}

// 포커스 관리 훅
export function useFocusManagement() {
  const trapFocus = (containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', handleTabKey);
    
    // 첫 번째 요소에 포커스
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (previousElement?: HTMLElement | null) => {
    if (previousElement && previousElement.focus) {
      previousElement.focus();
    }
  };

  return { trapFocus, restoreFocus };
}

// 접근성 알림 훅
export function useAccessibilityAnnouncements() {
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // 1초 후 제거
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announceToScreenReader };
}

// 스킵 링크 컴포넌트
export function SkipLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:no-underline"
      onFocus={() => {
        // 스킵 링크가 포커스될 때 화면에 표시
      }}
    >
      {children}
    </a>
  );
}
