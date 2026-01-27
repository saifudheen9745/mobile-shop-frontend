"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { ReactQueryClientProvider } from "@/providers/react-query-provider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </ReactQueryClientProvider>
  );
}
