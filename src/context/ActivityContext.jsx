import { createContext, useContext, useReducer } from 'react'
import { INITIAL_ACTIVITIES } from '../data/activities'

const ActivityContext = createContext(null)

const initialState = {
  activities: INITIAL_ACTIVITIES,
  toolFilter: 'all',
  selectedActivity: null,
  newActivityCount: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [action.payload, ...state.activities],
        newActivityCount: state.newActivityCount + 1,
      }
    case 'APPROVE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(a =>
          a.id === action.id ? { ...a, status: 'completed' } : a
        ),
        selectedActivity:
          state.selectedActivity?.id === action.id
            ? { ...state.selectedActivity, status: 'completed' }
            : state.selectedActivity,
      }
    case 'REJECT_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(a =>
          a.id === action.id ? { ...a, status: 'undone' } : a
        ),
        selectedActivity:
          state.selectedActivity?.id === action.id
            ? { ...state.selectedActivity, status: 'undone' }
            : state.selectedActivity,
      }
    case 'UNDO_ACTIVITY':
      {
        const original = state.activities.find(a => a.id === action.id)
        if (!original || !original.reversible) return state

        const undoActivity = {
          id: Date.now(),
          tool: original.tool,
          action: `Undid: ${original.action}`,
          reason: `You asked Libra to undo this ${original.tool} action, so the rollback was logged here.`,
          time: new Date().toISOString(),
          status: 'completed',
          outcome: 'Undo completed and recorded in the activity trail',
          reversible: false,
          isNew: true,
          dataTouched: original.dataTouched || [],
          detail: {
            reasoning: [
              'Received your undo request from the activity detail panel.',
              'Checked that this action had a concrete rollback path.',
              'Applied the rollback in the connected tool.',
              'Added this entry so the activity trail shows both the original action and the undo.',
            ],
            before: original.detail?.after || original.outcome || original.action,
            after: original.detail?.before || 'The action was returned to its previous state where possible.',
            alternativeConsidered: 'Did not delete the original activity entry because the audit trail should remain complete.',
          },
        }

        const updatedActivities = state.activities.map(a =>
          a.id === action.id ? { ...a, outcome: 'Undo completed and logged below', reversible: false } : a
        )

        return {
          ...state,
          activities: [undoActivity, ...updatedActivities],
          selectedActivity:
            state.selectedActivity?.id === action.id
              ? { ...state.selectedActivity, outcome: 'Undo completed and logged below', reversible: false }
              : state.selectedActivity,
          newActivityCount: state.newActivityCount + 1,
        }
      }
    case 'SET_TOOL_FILTER':
      return { ...state, toolFilter: action.payload }
    case 'SELECT_ACTIVITY':
      return { ...state, selectedActivity: action.payload }
    case 'CLOSE_DETAIL':
      return { ...state, selectedActivity: null }
    case 'CLEAR_NEW_BADGE':
      return { ...state, newActivityCount: 0 }
    default:
      return state
  }
}

export function ActivityProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error('useActivity must be inside ActivityProvider')
  return ctx
}
