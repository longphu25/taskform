import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import type { FormField } from '../../../types/form'
import { nanoid } from 'nanoid'

type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'

interface DesignerContextType {
  elements: FormField[]
  setElements: (elements: FormField[]) => void
  addElement: (index: number, element: FormField) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<FormField>) => void
  selectedElement: FormField | null
  setSelectedElement: (element: FormField | null) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  duplicateElement: () => void
  moveElementUp: () => void
  moveElementDown: () => void
  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
}

const DesignerContext = createContext<DesignerContextType | null>(null)
const MAX_HISTORY = 50

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [elements, setElementsState] = useState<FormField[]>([])
  const [selectedElement, setSelectedElement] = useState<FormField | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  const [history, setHistory] = useState<FormField[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoRedo = useRef(false)

  const setElements = useCallback(
    (newElements: FormField[]) => {
      setElementsState(newElements)
      if (!isUndoRedo.current) {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1)
          newHistory.push(newElements)
          return newHistory.slice(-MAX_HISTORY)
        })
        setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
        setSaveStatus('unsaved')
      }
      isUndoRedo.current = false
    },
    [historyIndex],
  )

  const addElement = useCallback(
    (index: number, element: FormField) => {
      const next = [...elements.slice(0, index), element, ...elements.slice(index)]
      setElements(next)
      setSelectedElement(element)
    },
    [elements, setElements],
  )

  const removeElement = useCallback(
    (id: string) => {
      setElements(elements.filter((el) => el.id !== id))
      if (selectedElement?.id === id) setSelectedElement(null)
    },
    [elements, selectedElement, setElements],
  )

  const updateElement = useCallback(
    (id: string, updates: Partial<FormField>) => {
      const updated = elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
      setElements(updated)
      if (selectedElement?.id === id) {
        setSelectedElement({ ...selectedElement, ...updates })
      }
    },
    [elements, selectedElement, setElements],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true
      setHistoryIndex(historyIndex - 1)
      setElementsState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true
      setHistoryIndex(historyIndex + 1)
      setElementsState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const duplicateElement = useCallback(() => {
    if (!selectedElement) return
    const newEl: FormField = {
      ...selectedElement,
      id: nanoid(),
      options: selectedElement.options ? [...selectedElement.options] : undefined,
      uploadSettings: selectedElement.uploadSettings
        ? { ...selectedElement.uploadSettings }
        : undefined,
    }
    const idx = elements.findIndex((el) => el.id === selectedElement.id) + 1
    const next = [...elements.slice(0, idx), newEl, ...elements.slice(idx)]
    setElements(next)
    setSelectedElement(newEl)
  }, [selectedElement, elements, setElements])

  const moveElementUp = useCallback(() => {
    if (!selectedElement) return
    const idx = elements.findIndex((el) => el.id === selectedElement.id)
    if (idx <= 0) return
    const next = [...elements]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    setElements(next)
  }, [selectedElement, elements, setElements])

  const moveElementDown = useCallback(() => {
    if (!selectedElement) return
    const idx = elements.findIndex((el) => el.id === selectedElement.id)
    if (idx < 0 || idx >= elements.length - 1) return
    const next = [...elements]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setElements(next)
  }, [selectedElement, elements, setElements])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && e.key === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      }
      if (isMod && e.key === 'y') {
        e.preventDefault()
        redo()
      }
      if (isMod && e.key === 'd') {
        e.preventDefault()
        duplicateElement()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          e.preventDefault()
          removeElement(selectedElement.id)
        }
      }
      if (isMod && e.key === 'ArrowUp') {
        e.preventDefault()
        moveElementUp()
      }
      if (isMod && e.key === 'ArrowDown') {
        e.preventDefault()
        moveElementDown()
      }
      if (e.key === 'Escape') {
        setSelectedElement(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, duplicateElement, removeElement, selectedElement, moveElementUp, moveElementDown])

  return (
    <DesignerContext.Provider
      value={{
        elements,
        setElements,
        addElement,
        removeElement,
        updateElement,
        selectedElement,
        setSelectedElement,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        duplicateElement,
        moveElementUp,
        moveElementDown,
        saveStatus,
        setSaveStatus,
      }}
    >
      {children}
    </DesignerContext.Provider>
  )
}

export function useDesigner() {
  const ctx = useContext(DesignerContext)
  if (!ctx) throw new Error('useDesigner must be used within DesignerProvider')
  return ctx
}
