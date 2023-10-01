import { Component, ViewChild, ElementRef } from '@angular/core';
import { Event } from 'src/app/Model/event';
import { EarlyBird } from 'src/app/Model/earlybird';
import { EventService } from '../services/event.service';
import { PhotoService } from '../services/eventdamage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DamageImage } from 'src/app/Model/damageImage';

@Component({
  selector: 'app-event-damage',
  templateUrl: './event-damage.component.html',
  styleUrls: ['./event-damage.component.css']
})
export class EventDamageComponent {
  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];
  selectedEvents: Event[] = [];
  selectedEventIds: number[] = [];
  filteredPhotos: any[] = [];
  photos: DamageImage[] = [];
  showImageModal: boolean = false;
  selectedImage: string | null = null;

  @ViewChild('content', { static: false }) content: ElementRef | undefined;

  constructor(
    public photoService: PhotoService,
    private eventService: EventService,
    private modalService: NgbModal,
  ) {}

  async ngOnInit() {
    await this.photoService.getAllImagesFromServer();
    this.loadEventData();
  }

  async loadEventData(): Promise<void> {
    const currentDate = new Date();
    const allEvents = await this.eventService.getEvents();

    this.events = allEvents.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate <= currentDate;
    });
  }

  isSelected(eventID: number): boolean {
    return this.selectedEventIds.includes(eventID);
  }

  toggleSelection(eventID: number): void {
    const index = this.selectedEventIds.indexOf(eventID);
    if (index !== -1) {
      // Event ID is already in the array, so remove it (unselect)
      this.selectedEventIds.splice(index, 1);
    } else {
      // Event ID is not in the array, so add it (select)
      this.selectedEventIds.push(eventID);
    }
  }

  openModal() {
    if (this.content) {
      const modalRef = this.modalService.open(this.content, {
        centered: true,
        size: 'lg',
      });
    }
  }
  

  applySelections() {
    this.selectedEvents = this.events.filter((event) =>
      this.isSelected(event.eventID)
    );
    this.modalService.dismissAll();
  }

  getImagesForEvent(eventId: number): DamageImage[] {
    return this.photoService.photos.filter((image) => image.eventID === eventId);
  }

  // openImageModal(imageSrc: string) {
  //   this.selectedImage = imageSrc;

  //   console.log(imageSrc)
  //   const modalRef = this.modalService.open('imageModal', {
  //     centered: true,
  //     size: 'lg',
  //   });

  //   modalRef.result.then(
  //     (result) => {
  //       // Modal closed
  //       this.selectedImage = null; // Clear the selected image when the modal is closed
  //     },
  //     (reason) => {
  //       // Modal dismissed
  //       this.selectedImage = null; // Clear the selected image when the modal is dismissed
  //     }
  //   );
  // }

  openImageModal(filepath: string){
    this.selectedImage = filepath;
    this.showImageModal = true;
  }

  closeImageModal(){
    this.showImageModal = false;
  }
  
}
