import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Brain, Radar, Zap, Users, Target } from 'lucide-react'
import FukulisaneOne from '@/components/FukulisaneOne'
import BusinessIntelligenceEngine from '@/components/BusinessIntelligenceEngine'
import CustomerBuyingProfiler from '@/components/CustomerBuyingProfiler'
import OpportunityIntelligenceWizard from '@/components/OpportunityIntelligenceWizard'

const TABS = [
  { id: 'deep-scan', label: 'Deep Scan', icon: Brain, desc: 'Business profile & digital presence' },
  { id: 'market-intel', label: 'Market Intel', icon: Radar, desc: 'Deep search & visibility analysis' },
  { id: 'business-intel', label: 'Business Intel', icon: Zap, desc: 'Strategy, risks & health scores' },
  { id: 'customer-intel', label: 'Customer Intel', icon: Users, desc: 'Buying behavior & profiling' },
  { id: 'opportunity-intel', label: 'Opportunity Intel', icon: Target, desc: 'Lead pipeline & opportunities' },
]

/** Renders the tab navigation and the selected business-intelligence view. */
export default function IntelligenceHub() {
  const [activeTab, setActiveTab] = useState('deep-scan')
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center min-w-[120px] whitespace-nowrap',
                activeTab === tab.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50')}
              title={tab.desc}>
              <Icon className="h-3.5 w-3.5" /><span>{tab.label}</span>
            </button>
          )
        })}
      </div>
      {activeTab === 'deep-scan' && <FukulisaneOne />}
      {activeTab === 'market-intel' && <FukulisaneOne />}
      {activeTab === 'business-intel' && <BusinessIntelligenceEngine />}
      {activeTab === 'customer-intel' && <CustomerBuyingProfiler />}
      {activeTab === 'opportunity-intel' && <OpportunityIntelligenceWizard />}
    </div>
  )
}
