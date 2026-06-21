import { useCallback, useState } from "react";
import { Button, Input, Loader, Modal, Toast } from "../components/ui";

const toastMessages = {
  success: "Your eco-stay was saved successfully.",
  error: "We could not complete that request.",
  warning: "Only two rooms remain for these dates.",
  info: "New low-impact stays were added nearby.",
};

/**
 * Component Showcase Page
 *
 * Demonstrates every shared UI component, state, variant, and size.
 *
 * @returns {React.ReactElement}
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  return (
    <main className="container-page py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-leaf">Week 3 design system</p>
        <h1 className="mt-2 font-display text-4xl text-forest dark:text-white md:text-6xl">UI component showcase</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Reusable controls and feedback patterns used across ECOSTAY.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ShowcaseSection title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Loaders">
          <div className="flex flex-wrap items-end gap-8">
            {["sm", "md", "lg"].map((size) => (
              <div key={`spinner-${size}`} className="text-center text-xs text-slate-500">
                <Loader size={size} />
                <p className="mt-2">Spinner {size}</p>
              </div>
            ))}
            {["sm", "md", "lg"].map((size) => (
              <div key={`pulse-${size}`} className="text-center text-xs text-slate-500">
                <Loader variant="pulse" size={size} />
                <p className="mt-2">Pulse {size}</p>
              </div>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" placeholder="Your name" required />
            <Input label="Email" type="email" placeholder="you@example.com" helperText="We never share your email." />
            <Input label="Password" type="password" placeholder="At least 8 characters" />
            <Input label="Search" type="search" placeholder="Search stays" error="Try a destination or property name." />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Feedback">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(toastMessages).map((type) => (
              <Button key={type} size="sm" variant="outline" onClick={() => setToast(type)}>
                {type[0].toUpperCase() + type.slice(1)} toast
              </Button>
            ))}
          </div>
        </ShowcaseSection>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Plan a conscious stay"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Continue</Button></>}
      >
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">This modal supports keyboard dismissal, backdrop clicks, focus placement, and animated entry and exit.</p>
      </Modal>
      <Toast
        isOpen={Boolean(toast)}
        type={toast || "info"}
        message={toast ? toastMessages[toast] : ""}
        onClose={closeToast}
      />
    </main>
  );
}

function ShowcaseSection({ title, children }) {
  return (
    <section className="paper rounded-lg border border-black/5 bg-white p-5 dark:border-white/10 md:p-6">
      <h2 className="mb-5 text-lg font-extrabold text-forest dark:text-white">{title}</h2>
      {children}
    </section>
  );
}
