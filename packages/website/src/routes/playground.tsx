import { Outlet } from 'solid-start';
import { SideBar, Debugger, Tabs } from '~/components';
import { FormProvider, useForm } from '~/contexts';

export default function PlaygroundLayout() {
  return (
    <FormProvider>
      <main class="flex w-full max-w-screen-xl flex-1 flex-col self-center lg:flex-row lg:space-x-9">
        <div class="min-full flex-1 space-y-12 py-12 md:space-y-14 md:py-20 lg:space-y-16 lg:py-32">
          <Tabs items={['Login', 'Payment', 'Todos', 'Special', 'Nested']} />
          <Outlet />
        </div>
        <SideBar>
          <Debugger of={useForm().get()} />
        </SideBar>
      </main>
    </FormProvider>
  );
}
