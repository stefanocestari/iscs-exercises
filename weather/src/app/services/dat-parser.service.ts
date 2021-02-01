import { Injectable } from '@angular/core';

export interface InputDefinition {
  label: string;
  length: number;
  type: string
  optional?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatParserService {

  constructor() { }

  parse(text:string, inputDefinitions:InputDefinition[] = []):any{
    
    let lines = text.split(/\r?\n/g); //split by newline chars to get all lines as array
    let k = -1;
    let inputs = lines[0].trim().replace(/ +/g, ',').split(',');
    let data = [];
    inputs = inputs.map( input => input.trim());

    for (let i = 1; i < lines.length; i++) { //skip first line as it is Nlines
      let line = lines[i];
        if(line) {
        let lineData:any = {};
        for (let id of inputDefinitions){
          let input = line.substr(0, id.length);
          line = line.substr(id.length, line.length);
            input =  input.trim();
            if (id.type === 'number') {
              lineData[id.label] = Number(input);
            } else {
              lineData[id.label] = input;
            }
        }
        if(this.dataValidator(lineData, inputDefinitions)){
          data.push(lineData);
        } else {
          console.log("data at line " + i + " is invalid")
        }
      }
    }
    console.log('parsedData =', data);

    return data;
  }

  dataValidator(lineData:any, inputDefinitions: InputDefinition[]):boolean{

    let check = true;
    for (let id of inputDefinitions){
      const prop = lineData[id.label];
      if (!( prop || prop === 0 || id.optional  )) {
        check = false;
      }
      if (lineData[id.type] === 'number') {
        if (isNaN(prop)) {
          check = false;
        }
      } 
    }
    
    return check;

   } 

}
