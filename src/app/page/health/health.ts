import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Play } from '@primeicons/angular/play';
import { Spinner } from '@primeicons/angular/spinner';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { HealthService } from '../../service/health.service';
import { HealthResponse } from '../../service/models';
import { i18n } from '../../../locale/_i18n_';

@Component({
  selector: 'app-health',
  imports: [RouterLink, ButtonDirective, Card, Message, Play, Spinner],
  templateUrl: './health.html',
  styleUrl: './health.scss',
})
export class Health {
  protected readonly i18n = i18n;

  private readonly healthService = inject(HealthService);

  protected readonly loading = signal(false);
  protected readonly result = signal<HealthResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  execute(): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.healthService.getHealth().subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error ?? err.message);
        this.loading.set(false);
      },
    });
  }
}
