import { Component, OnInit } from '@angular/core';
import { IResponse } from '../../../models/utils/response.model';

import { Router } from '@angular/router';
import { LoadingService } from '../../../services/utils/loading.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { ContactService } from '../../../services/security/contact.service';
import { IContact, ContactModel } from '../../../models/security/contact.model';
import { SettingService } from '../../../services/administration/setting.service';
import { ISetting } from '../../../models/administration/setting.model';

declare var ol: any;

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    providers: [ContactService, LoadingService, SettingService]
})
export class ContactComponent implements OnInit {
    contact: IContact;
    setting: ISetting;

    latitude: number = 18.5204;
    longitude: number = 73.8567;

    map: any;

    constructor(
        private contactService: ContactService,
        private loadingService: LoadingService,
        private notify: NotifyService,
        private router: Router,
        private settingService: SettingService
    ) {
        this.contact = new ContactModel();
    }

    ngOnInit() {
        this.loadingService.show('');
        this.settingService.current().subscribe((response: IResponse) => {
            if (response.result) {
                this.setting = response.doc;
                this.load_map();
            }
            this.loadingService.hide();
        })
    }

    load_map() {
        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([this.setting.longitude, this.setting.latitude]),
                zoom: this.setting.zoon
            })
        });
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([this.setting.longitude, this.setting.latitude], 'EPSG:4326', 'EPSG:3857')),
                })]
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: "fraction",
                    anchorYUnits: "fraction",
                    src: 'assets/images/marker.png'
                })
            })
        });
        this.map.addLayer(vectorLayer);
    }

    send() {
        this.loadingService.show('Enviando...');
        let contact:any = Object.assign({}, this.contact);
        contact.setting = this.setting._id;
        this.settingService.contact(contact).subscribe((response: IResponse) => {
            if (response.result) {
                this.router.navigate(['/site/home/success/' + `Gracias por ponerte en contacto con nosotro, estamos procesando su solicitud.`]);
            } else {
                this.notify.error(response.message, "Aviso");
            }
            this.loadingService.hide();
        })
    }
}