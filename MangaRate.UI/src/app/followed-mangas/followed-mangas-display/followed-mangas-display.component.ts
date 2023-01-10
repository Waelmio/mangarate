import { Component, Input } from '@angular/core';
import { Manga } from '@core/Models/API/Manga';

@Component({
  selector: 'app-followed-mangas-display',
  templateUrl: './followed-mangas-display.component.html',
  styleUrls: ['./followed-mangas-display.component.css']
})
export class FollowedMangasDisplayComponent {
    @Input() mangas: Manga[] | null= [];
}
