import AppLayout from 'components/AppLayout'
import { Card } from 'primereact/card'
import { Menu } from './MenuLayout'

function AppLayoutMenus({ children, items }) {
  return (
    <AppLayout>
      <div className="flex flex-row w-[95%] lg:h-[85%] gap-4 m-auto pb-12">
        <div className="basis-full xl:basis-[90%]">
          <Card className="redondeo-xl h-[80vh] max-h-[80vh] lg:h-full overflow-auto border-2 border-[#dbcdae] opacity-70">
            {children}
          </Card>
        </div>
        <div className="basis-[12rem] hidden xl:flex h-[80vh] max-h-[80vh] overflow-auto opacity-70">
          <Menu items={items} />
        </div>
      </div>
    </AppLayout>
  )
}

export { AppLayoutMenus }
