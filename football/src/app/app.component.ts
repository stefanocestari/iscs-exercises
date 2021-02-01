import { Component } from '@angular/core';
import { DatParserService, InputDefinition } from './services/dat-parser.service';

export interface TeamRecord {
  placement: string;
  teamName: string;
  played: number;
  wins: number;
  lossess: number;
  draws: number;
  f: number;
  a: number;
  points: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  inputDefinitions:InputDefinition[] = [
    { label: 'placement', length: 7, type: 'String' },
    { label: 'teamName', length: 16, type: 'String' },
    { label: 'played', length: 6, type: 'Number' },
    { label: 'wins', length: 4, type: 'Number' },
    { label: 'losses', length: 4, type: 'Number' },
    { label: 'draws', length: 6, type: 'Number' },
    { label: 'f', length: 4, type: 'Number' },
    { label: 'separator', length: 3, type: 'String' },
    { label: 'a', length: 6, type: 'Number' },
    { label: 'points', length: 3, type: 'Number' },
  ]; 

  inputFile:any;
  data: TeamRecord[] | any | null = null;
  lesserGoalGap: number = 0;

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
            this.lesserGoalGap = this.getLesserGoalGap();
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
     return this.inputDefinitions.filter(id => id.label !== 'separator')
   }

   getLesserGoalGap() {

    if(this.data){
      let ggArray = this.data.map((d:TeamRecord) => {
        return  Math.abs(d.a - d.f)
      })
      
      ggArray = ggArray.sort((a:number, b:number) => a - b);

      return ggArray[0];

    }
    return null;
   }

   hasLesserGoalGap(tr:TeamRecord) {
    const goalGap = Math.abs(tr.a - tr.f);
    return goalGap === this.lesserGoalGap;
   }


}
