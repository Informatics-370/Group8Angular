import { Component, OnInit } from '@angular/core';
import { Blacklist } from 'src/app/Model/blacklist';
import { BlacklistService } from '../services/blacklist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit{

    blacklistC: Blacklist[] = [];
    showModal: boolean = false;
    editingBlacklistC: boolean = false;
    currentBlacklistC: Blacklist = new Blacklist();
    
    constructor(private blacklistService: BlacklistService, private router: Router) {}
  
    //When the page is called these methods are automatically called
    ngOnInit(): void {
      this.loadBlacklistCs();
    }
  
  
    //retrieves all the information in the Blacklist table from the database and stores it in the blacklist array.
    async loadBlacklistCs(): Promise<void> {
      try {
        this.blacklistC = await this.blacklistService.getBlacklist();
      } catch (error) {
        console.error(error);
      }
      };
    } 
