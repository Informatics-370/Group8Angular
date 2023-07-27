import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AOS from 'aos';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // If you're placing it in your main.ts
platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err))
.then(() => AOS.init());

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .then(() => AOS.init({
    startEvent: 'DOMContentLoaded', // Name of the event dispatched on the document, that AOS should initialize on
    once: true, // Whether animation should happen only once - while scrolling down
  }));


