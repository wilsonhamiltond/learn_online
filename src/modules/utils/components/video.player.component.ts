import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IMedia } from '../../../models/training/media.model';
import { MEDIA_TYPE_ENUM } from '../../../services/training/media.service';

declare var YT:any, window:any, document:any;

@Component({
    styles: [` 
        figure {
            width:100%;
            height: 100%;
            background-color: black;
        }
        figcaption {
            display:block;
            font-size:16px;
            font-size:1rem;
        }
        video {
            width:100%;
            height: 100%;
        }
        div.overlap-play{
            position: absolute;
            top: 0px;
            left: 0px;
            background-color: rgba(230, 230, 230, 0.34);
            width: 100%;
            height: 100%;
            z-index: 1000;
        }
        div.overlap-play a{
            background-color: rgba(0, 0, 0, 0.19);
            left: 50%;
            top: 50%;
            margin-top: -32px;
            margin-left: -32px;
            position: relative;
            height: 64px;
            width: 64px;
            display: block;
            font-size: 36pt;
            padding: 0px 18px;
            border-radius: 50%;
        }
    `],
    selector: 'video-player',
    templateUrl: './video.player.component.html'
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('video')
    private video: ElementRef;

    private isPlaying: boolean = false;
    @ViewChild('videoContainer')
    private videoContainer: ElementRef;

    @Output()
    onVideoEnd = new EventEmitter();

    @Input()
    media: IMedia;

    private youtubePlayer: any;
    drive_video:string  = MEDIA_TYPE_ENUM.drive_video;
    constructor(
        private elementRef: ElementRef
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit(){
        this.onYouTubePlayer();
    }
    onYouTubePlayer(){
        if(this.isYoutube() == false)
            this.loadEvent();
        else{
            if ((typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') && !this.youtubePlayer) {
                var tag:any = document.createElement('script');
                tag.src = "https://www.youtube.com/player_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubePlayerAPIReady = () => {
                    this.onYouTubePlayer();
                }
            } else if( YT.Player ){
                new YT.Player('ytplayer', {
                    height: '360',
                    width: '640',
                    videoId: this.media.url,
                    events: {
                        onStateChange: (event:any)=>{
                            if( event.data == 0 ){
                                this.isPlaying = false;
                                this.onVideoEnd.next(this.media);
                            }
                        }
                    }
                });
            } else{
                window.setTimeout(() => {
                    this.onYouTubePlayer();
                }, 500);
            } 
        }
    }
    
    loadEvent(){
        this.video.nativeElement.addEventListener('ended', ()=>{
            this.isPlaying = false;
            this.onVideoEnd.next(this.media);
        },false);
    }
    ngOnDestroy(){
        this.isPlaying = false;
    }

    play(){
        this.video.nativeElement.play();
        this.isPlaying = true;
    }
    
    isYoutube( ){
        let media:any = this.media;
        if(!media)
            return false;
        return media.type == MEDIA_TYPE_ENUM.youtube && media.type == MEDIA_TYPE_ENUM.youtube;
    }
}