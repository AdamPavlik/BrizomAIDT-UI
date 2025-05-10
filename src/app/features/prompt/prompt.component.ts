import {Component, OnInit} from '@angular/core';
import {Prompt, PromptService} from '../../core/grapfql/prompt.service';
import {NgForOf} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-prompt',
  imports: [
    NgForOf,
    MatExpansionModule,
    MatFormFieldModule,
    MatInput,
    MatSlideToggle,
    MatButton,
    MatCardModule,
    MatOption,
    MatSelect,
    FormsModule
  ],
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.scss'
})
export class PromptComponent implements OnInit {

  public prompts: Prompt[] = [];

  constructor(private promptService: PromptService) {
  }

  ngOnInit(): void {
    this.promptService.getPrompts().then(prompts => this.prompts = prompts);
  }

  addPrompt(promptStr: string, role: string): void {
    let prompt: Prompt = {
      prompt: promptStr,
      role: role,
      enabled: false
    }
    this.promptService.addPrompt(prompt).then(promptResult => {
      this.prompts.unshift(promptResult);
    })
  }

  updatePrompt(prompt: Prompt): void {
    this.promptService.updatePrompt(prompt).then();
  }

  deletePrompt(id: string): void {
    this.promptService.deletePrompt(id).then(result => {
      if (result) {
        this.prompts = this.prompts.filter(prompt => prompt.id !== id);
      }
    })
  }


}
