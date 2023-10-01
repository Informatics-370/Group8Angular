import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DamageImage } from 'src/app/Model/damageImage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: DamageImage[] = [];

  constructor(private http: HttpClient) { }

  public async saveImageToServer(image: FormData) {
    const apiUrl = `${environment.baseApiUrl}api/DamageImages`; 
    
    console.log('Sending FormData to server'); 
    console.log(image.get('file'))
   
    image.forEach((key,value)=>{console.log(key +" : "+ value)})

    return this.http.post<DamageImage>(apiUrl, image).toPromise();

  }

  public async getAllImagesFromServer() {
    const apiUrl = `${environment.baseApiUrl}api/DamageImages`;
    const images = await this.http.get<DamageImage[]>(apiUrl).toPromise();
    if (images) {
      this.photos = images;
    }
    return images;
  }

  public async deleteImageFromServer(imageId: number) {
    const apiUrl = `${environment.baseApiUrl}api/DamageImages/${imageId}`;
    await this.http.delete(apiUrl).toPromise();
  
    // Remove the image from the local array
    this.photos = this.photos.filter(photo => photo.id !== imageId);
  }
}

