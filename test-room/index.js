import { Neutrino } from '../core/neutrino';
import { FirstComponent } from './components/MyComponent';
import { SecondComponent } from './components/SecondComponent';



const app = new Neutrino({
    components:[
        FirstComponent,
        SecondComponent
    ],
    services: []
})