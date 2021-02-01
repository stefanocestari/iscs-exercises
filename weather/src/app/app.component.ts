import { Component } from '@angular/core';
import { DatParserService, InputDefinition } from './services/dat-parser.service';

export interface WeatherRecord {
  day: number;
  maxT: string;
  minT: string;
  avT: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  inputDefinitions:InputDefinition[] = [
    { label: 'day', length: 5, type: 'string' },
    { label: 'maxT', length: 6, type: 'string' },
    { label: 'minT', length: 6, type: 'string' },
    { label: 'avT',  length: 6, type: 'string' },
    { label: 'HDDay', length: 7, type: 'number', optional: true },
    { label: 'AvDP', length: 5, type: 'number' },
    { label: '1HrP', length: 5, type: 'number', optional: true },
    { label: 'TPcpn', length: 6, type: 'number' },
    { label: 'WxType', length: 7, type: 'string', optional:true },
    { label: 'PDir', length: 5, type: 'number' },
    { label: 'AvSp', length: 5, type: 'number' },
    { label: 'Dir', length: 4, type: 'number' },
    { label: 'MxS', length: 4, type: 'string' },
    { label: 'SkyC', length: 5, type: 'number' },
    { label: 'MxR', length: 4, type: 'number' },
    { label: 'MnR', length: 3, type: 'number' },
    { label: 'AvSLP', length: 6, type: 'number' },
  ]; 

  inputFile:any;
  data: WeatherRecord[] | any | null = null;
  lesserTemperatureGap: number = 0;

  constructor(
    private datParser: DatParserService
  ){};

  processData() {

    if (this.inputFile) {
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        const text = fileReader.result?.toString();
        if(text){
          let data = this.datParser.parse(text, this.inputDefinitions);
          if (data.length) {
            this.data = data;
            this.lesserTemperatureGap = this.getLesserTemperatureGap();
          } else {
            this.data = [];
            setTimeout( () => {
              window.alert("Il file non contiene dati validi");
            }, 0);
          }
        }
      }
      
      fileReader.readAsText(this.inputFile);
    } else {
      window.alert("Seleziona un file");
    }

  }
 
  updateInputFile(e:any) {
    this.inputFile = e.target.files[0];
   }

   getTableData() {
     return this.inputDefinitions;
   }

   getLesserTemperatureGap() {

    if(this.data){
      let tgArray = this.data.map((d:WeatherRecord) => {
        const a = Number(d.maxT.replace('*', ''));
        const b = Number(d.minT.replace('*', ''));
        return  Math.abs(a - b)
      })
      
      tgArray = tgArray.sort((a:number, b:number) => a - b);

      return tgArray[0];

    }
    return null;
   }

   hasLesserTemperatureGap(tr:WeatherRecord) {
    const a = Number(tr.maxT.replace('*', ''));
    const b = Number(tr.minT.replace('*', ''));
    const TemperatureGap = Math.abs(a - b);
    return TemperatureGap === this.lesserTemperatureGap;
   }



}
