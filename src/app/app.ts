import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Componentes/HomePage/header/header';
import { Footer } from './Componentes/HomePage/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend-gestor-tarefas';
}
