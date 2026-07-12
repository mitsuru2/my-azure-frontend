import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Play } from '@primeicons/angular/play';
import { Spinner } from '@primeicons/angular/spinner';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { switchMap } from 'rxjs';

import { TransactionsService } from '../../service/transactions.service';
import { OrchestrationStatusResponse } from '../../service/models';

const ACCOUNTS: string[] = ['高橋充', '高橋恵'];

@Component({
  selector: 'app-transactions',
  imports: [
    RouterLink,
    FormsModule,
    JsonPipe,
    ButtonDirective,
    Card,
    FileUpload,
    Message,
    Select,
    Play,
    Spinner,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly accounts = ACCOUNTS;
  protected readonly account = signal<string>(ACCOUNTS[0]);
  protected readonly selectedFile = signal<File | null>(null);

  protected readonly submitting = signal(false);
  protected readonly status = signal<OrchestrationStatusResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly canSubmit = () =>
    !this.submitting() && this.selectedFile() !== null && this.account().trim().length > 0;

  onFileSelect(event: FileSelectEvent): void {
    const files = event.currentFiles;
    this.selectedFile.set(files.length > 0 ? files[files.length - 1] : null);
  }

  onFileClear(): void {
    this.selectedFile.set(null);
  }

  execute(): void {
    const file = this.selectedFile();
    if (!file || !this.canSubmit()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    this.status.set(null);

    this.transactionsService
      .encodeFileAsBase64(file)
      .pipe(
        switchMap((csv) =>
          this.transactionsService.submit({
            format: 'SBI',
            account: this.account().trim(),
            csv,
          }),
        ),
      )
      .subscribe({
        next: (status) => {
          this.status.set(status);
          this.submitting.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error ?? err.message);
          this.submitting.set(false);
        },
      });
  }
}
