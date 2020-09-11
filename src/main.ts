import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { configure, spy } from 'mobx';

if (environment.production) {
  enableProdMode();
}

// TODO: debugging spy
// spy((event) => {
//   if (event.type) {
//     console.warn(`event ${event.name} of type ${event.type} with args: ${event.arguments}`);
//   }
// });

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    // TODO: config
    configure({
      enforceActions: 'always',
      computedRequiresReaction: true
    });
  })
  .catch(err => console.error(err));
