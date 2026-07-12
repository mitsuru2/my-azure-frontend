import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { i18nLabels } from '../locale/_i18n_';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('my-azure-frontend');
  protected readonly labels = i18nLabels;
}
