import React from 'react';
import { InulaRouter, InulaRoute } from 'openinula';

function App() {
  return (
    <InulaRouter>
      <InulaRoute path="/" component={Home} />
      <OtherComponent />
    </InulaRouter>
  );
}