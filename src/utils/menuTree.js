import React from "react";
import NewDocument from './../routes/AuftragAnlegen';
import Position from './../routes/Positionen';
import PositionCopy from './../routes/Positionen/PositionCopy';
import MatCorrection from './../routes/MatCorrection';
import CutFoldCorrection from './../routes/CutFoldCorrection';
import DataGridViewer from '../components/DataGridViewer';
import IncomingMaterial from '../routes/IncomingMaterial';
import IncomingInvoice from '../routes/IncomingInvoice';
import ClientSpecialPrice from '../routes/ClientSpecialPrice';
import SteelShapesExplorer from '../routes/SteelShapesExplorer';

export default {
    "Bearbeitung": {
        "Verkauf": {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Auftrag anlegen": {
                    "route": '/auftrag_anlegen',
                    "navigationItems": ["[F8] Auftrag Kopieren"],
                    "component": <NewDocument documentType='order'/>,
                    "categories": null
                },
                "Betonstahl": {
                    "route": "/betonstahl",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='order' type='rebar' bendGroup='others'/>,
                    "categories": null
                },
                "Träger/Stabstahl": {
                    "route": "/traeger_stabstahl",
                    "navigationItems": ["[F7] Löschen"],
                    "component": <Position documentType='order' type='beam_steelbar' bendGroup='others'/>,
                    "categories": null
                },
                "Matten": {
                    "route": "/matten",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='order' type='mat' bendGroup='mat'/>,
                    "categories": null
                },
                "Bleche": {
                    "route": "/bleche",
                    "navigationItems": ["[F7] Löschen"],
                    "component": <Position documentType='order' type='sheet' bendGroup='others'/>,
                    "categories": null
                },
                "Zubehör": {
                    "route": "/zubehoer",
                    "navigationItems": ["[F7] Löschen"],
                    "component": <Position documentType='order' type='equipment' bendGroup='others'/>,
                    "categories": null
                },
                "Rohre": {
                    "route": "/rohre",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='order' type='tube' bendGroup='others'/>,
                    "categories": null
                },
                "Dienstleistungen": {
                    "route": "/dienstleistungen",
                    "navigationItems": ["[F7] Löschen"],
                    "component": <Position documentType='order' type='services' bendGroup='others'/>,
                    "categories": null
                },
                "Körbe": {
                    "route": "/koerbe",
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Position Kopieren": {
                    "route": "/positionen_kopieren",
                    "navigationItems": [],
                    "component": <PositionCopy/>,
                    "categories": null
                },
                "Auftragsbestätigung": {
                    "route": "/auftragsbestaetigung",
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Mattenberichtigung": {
                    "route": "/mattenberichtigung",
                    "navigationItems": [],
                    "component": <MatCorrection documentType='order'/>,
                    "categories": null
                },
                "Schneide-, Abkantberichtigung": {
                    "route": "/schneide_abkantberichtigung",
                    "navigationItems": [],
                    "component": <CutFoldCorrection documentType='order'/>,
                    "categories": null
                },
                "Lieferscheine": {
                    "route": "/lieferscheine",
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Rechnungen": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [{
                        "category": "Einzelrechnung drucken",
                        "route": "/einzelrechnung_drucken",
                        "navigationItems": [],
                        "component": null
                    },
                        {
                            "category": "Sammelrechnung drucken",
                            "route": "/sammelrechnung_drucken",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Einzelrechnung (Info)",
                            "route": "/einzelrechnung_info",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Sammelrechnung (Info)",
                            "route": "/sammelrechnung_info",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Abschlagsrechnung Verlegen",
                            "route": "/abschlagsrechnung_verlegen",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Dechblatt Abschlagsrechnung",
                            "route": "/dechblatt_abschlagsrechnung",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Leistungsaufnahme Abschlagsrechnung",
                            "route": "/leistungsaufnahme_abschlagsrechnung",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Leistungsaufnahme Lieferschein",
                            "route": "/leistungsaufnahme lieferschein",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "sammler",
                            "route": "/sammler",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Gutschriften",
                            "route": "/gutschriften",
                            "navigationItems": [],
                            "component": null
                        }, {
                            "category": "Nummern ändern",
                            "route": "/nummern_aendern",
                            "navigationItems": [],
                            "component": null
                        }]
                },
                "Biegekarten": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories":
                        [{
                            "category": "Biegekarten drucken",
                            "route": "/biegekarten_drucken",
                            "navigationItems": [],
                            "component": null
                        },
                            {
                                "category": "Biegekarten sortiert drucken",
                                "route": "/biegekarten_sortiert_drucken",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Biegekarten einzeln drucken",
                                "route": "/biegekarten_einzeln_drucken",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Deckblätter drucken",
                                "route": "/deckblaetter_drucken",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Positionen übergeben",
                                "route": "/positionen_uebergeben",
                                "navigationItems": [],
                                "component": null
                            }
                        ]
                },
                "Zahlungseingang": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories":
                        [{
                            "category": "Zahlungen erfassen",
                            "route": "/zahlungen_erfassen",
                            "navigationItems": [],
                            "component": null
                        },
                            {
                                "category": "Ausgangsrechnung erfassen",
                                "route": "ausgangsrechnung_erfassen",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Kontenblatt für AR Kunde",
                                "route": "/kontenblatt_fuer_AR_Kunde",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Kontenblatt für AR KST",
                                "route": "/kontenblatt_fuer_AR_KST",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Liste offene Posten Kunde",
                                "route": "/liste_offene_Posten_Kunde",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Liste fällige Rechnungen",
                                "route": "/liste_faellige_Rechnungen",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Umsatz unbenannte Kunden",
                                "route": "/umsatz_unbenannte_Kunden",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Umsatz benannte Kunden",
                                "route": "/umsatz_benannte_Kunden",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "Liste Eingangszahlungen",
                                "route": "/liste_Eingangszahlungen",
                                "navigationItems": [],
                                "component": null
                            }
                            ,
                            {
                                "category": "OP Kst ausbuchen",
                                "route": "/op_Kst_ausbuchen",
                                "navigationItems": [],
                                "component": null
                            }
                        ]
                },
            }
        },
        "Angebote": {
            "route": '/angebote',
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Angebot anlegen": {
                    "route": '/angebot_anlegen',
                    "navigationItems": ['[F8] Zum Auftrag umwandeln', '[F12] Angebot drucken'],
                    "component": <NewDocument documentType='offer'/>,
                    "categories": null
                },
                "Betonstahl": {
                    "route": "/angebot_betonstahl",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='rebar' bendGroup='others'/>,
                    "categories": null
                },
                "Staffeleisen": {
                    "route": "/angebot_staffeleisen",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='beam_steelbar' bendGroup='others'/>,
                    "categories": null
                },
                "Träger/Stabstahl": {
                    "route": '/angebot_traeger_stabstahl',
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='beam_steelbar' bendGroup='others'/>,
                    "categories": null
                },
                "Matten": {
                    "route": "/angebot_matten",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='mat' bendGroup='mat'/>,
                    "categories": null
                },
                "Bleche": {
                    "route": "/angebot_bleche",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='sheet' bendGroup='others'/>,
                    "categories": null
                },
                "Zubehör": {
                    "route": "/angebot_zubehoer",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='equipment' bendGroup='others'/>,
                    "categories": null
                },
                "Rohre": {
                    "route": "/angebot_rohre",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='tube' bendGroup='others'/>,
                    "categories": null
                },
                "Dienstleistungen": {
                    "route": "/angebot_dienstleistungen",
                    "navigationItems": ["[F2] Bilder Anzeigen", "[F3] Bild Vergrößern / Verkleinern", "[F7] Löschen"],
                    "component": <Position documentType='offer' type='services' bendGroup='others'/>,
                    "categories": null
                },
                "Mattenberichtigung": {
                    "route": "/angebot_mattenberichtigung",
                    "navigationItems": [],
                    "component": <MatCorrection documentType='offer'/>,
                    "categories": null
                },
                "Schneide- , Abkantberichtigung": {
                    "route": "/angebot_schneide_abkantberichtigung",
                    "navigationItems": [],
                    "component": <CutFoldCorrection documentType='offer'/>,
                    "categories": null
                },
            },
        },
        "Einkauf": {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Anlieferung erfassen": {
                    "route": '/anlieferung_erfassen',
                    "navigationItems": [],
                    "component": <IncomingMaterial/>,
                    "categories": null
                },
                "Materialzugänge ändern": {
                    "route": "/materialzugaenge_aendern",
                    "navigationItems": [],
                    "component": <DataGridViewer showCreate={false} viewer='incoming_material' column={[
                        {field: 'id', headerName: 'Satznummer', type: 'number', editable: false, width: 100},
                        {field: 'article_id', headerName: 'Artikelnr.', type: 'string', editable: false, width: 150},
                        {field: 'supplier_id', headerName: 'Liferant', type: 'number', editable: false, width: 250},
                        {field: 'price', headerName: 'Einkaufspreis', type: 'number', editable: true, width: 250},
                        {field: 'amount', headerName: 'Menge', type: 'number', editable: true, width: 250},
                        {field: 'date', headerName: 'Datum', type: 'date', editable: true, width: 250},
                    ]}/>,
                    "categories": null
                },
                "Eingangsrechnung": {
                    "route": "/eingangsrechnung",
                    "navigationItems": [],
                    "component": <IncomingInvoice/>,
                    "categories": null
                },
                "Zahlung erfassen": {
                    "route": "/zahlung_erfassen",
                    "navigationItems": [],
                    "component": <DataGridViewer uploadDocument
                                                 showUpdateAmount
                                                 showCreate={false}
                                                 viewer='incoming_invoices'
                                                 column={[
                                                     {
                                                         field: 'id',
                                                         headerName: 'Rechnungsnr.',
                                                         type: 'number',
                                                         editable: false,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'supplier_id',
                                                         headerName: 'Liferant-Nr',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'date',
                                                         headerName: 'Rechnungsdatum',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'brutto_amount',
                                                         headerName: 'Brutto Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 250
                                                     },
                                                     {
                                                         field: 'netto_amount',
                                                         headerName: 'Netto Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 250
                                                     },
                                                     {
                                                         field: 'payment_target_date',
                                                         headerName: 'Zahlungsziel',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 250
                                                     },
                                                     {
                                                         field: 'supplier_alias',
                                                         headerName: 'Liferant-Suchname',
                                                         type: 'string',
                                                         editable: true,
                                                         width: 250
                                                     },
                                                     {
                                                         field: 'supplier_name1',
                                                         headerName: 'Name1',
                                                         type: 'string',
                                                         editable: true,
                                                         width: 250,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'supplier_name2',
                                                         headerName: 'Name2',
                                                         type: 'string',
                                                         editable: true,
                                                         width: 250,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_1_per',
                                                         headerName: 'Skonto 1 %',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'deadline_1_date',
                                                         headerName: 'Skonto 1 Bis',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 150
                                                     },
                                                     {
                                                         field: 'deadline_1_amount',
                                                         headerName: 'Skonto 1 Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'deadline_2_per',
                                                         headerName: 'Skonto 2 %',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_2_date',
                                                         headerName: 'Skonto 2 Bis',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_2_amount',
                                                         headerName: 'Skonto 2 Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_3_per',
                                                         headerName: 'Skonto 3 %',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_3_date',
                                                         headerName: 'Skonto 3 Bis',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'deadline_3_amount',
                                                         headerName: 'Skonto 3 Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100,
                                                         hide: true
                                                     },
                                                     {
                                                         field: 'open_amount',
                                                         headerName: 'Offener Betrag',
                                                         type: 'number',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'payed',
                                                         headerName: 'Bezahlt',
                                                         type: 'boolean',
                                                         editable: true,
                                                         width: 100
                                                     },
                                                     {
                                                         field: 'payment_date',
                                                         headerName: 'Zahlungsdatum',
                                                         type: 'date',
                                                         editable: true,
                                                         width: 200
                                                     },
                                                     {
                                                         field: 'payment_method',
                                                         headerName: 'Zahlungsart',
                                                         type: 'string',
                                                         editable: true,
                                                         width: 200
                                                     },

                                                 ]}/>,
                    "categories": null
                },
            },
        },
    },
    "Informationen": {
        'Stahlbiegebilder zeigen': {
            "route": '/stahlbiegebilder_zeigen',
            "navigationItems": ["[F3] Bild Vergrößern / Verkleinern"],
            "component": <SteelShapesExplorer bendGroup='others'/>,
            "subMenus": null
        },
        'Mattenbiegebilder zeigen': {
            "route": '/mattenbiegebilder_zeigen',
            "navigationItems": ["[F3] Bild Vergrößern / Verkleinern"],
            "component": <SteelShapesExplorer bendGroup='mat'/>,
            "subMenus": null
        },
        'Rechnung Information': {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Einzelrechnung": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [
                        {
                            "category": "Lieferleistung",
                            "route": "/einzelrechnung_lieferleistung",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Verlegeleistung",
                            "route": "/einzelrechnung_verlegeleistung",
                            "navigationItems": [],
                            "component": null
                        }
                    ]
                },
                "Sammelrechnung": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [
                        {
                            "category": "Lieferleistung",
                            "route": "/sammelrechnung_lieferleistung",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Verlegeleistung",
                            "route": "/sammelrechnung_verlegeleistung",
                            "navigationItems": [],
                            "component": null
                        }
                    ]
                },
            }
        },
        'Liste Drucken': {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Kundenlisten": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [
                        {
                            "category": "Kundenliste",
                            "route": "/lange_kundenliste",
                            "navigationItems": [],
                            "component": <DataGridViewer viewer='client' column={[
                                {field: 'id', headerName: 'Kundennummer', type: 'number', editable: false, width: 100},
                                {field: 'alias', headerName: 'SuchName', type: 'string', editable: true, width: 150},
                                {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                                {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                                {
                                    field: 'person',
                                    headerName: 'Person',
                                    type: 'string',
                                    editable: true,
                                    width: 250,
                                    hide: true
                                },
                                {
                                    field: 'title',
                                    headerName: 'Anrede',
                                    type: 'string',
                                    editable: true,
                                    width: 250,
                                    hide: true
                                },
                                {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                                {field: 'postal_code', headerName: 'PLZ', type: 'number', editable: true, width: 100},
                                {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 100},
                                {
                                    field: 'country',
                                    headerName: 'Land',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'pre_number',
                                    headerName: 'Vorwahl',
                                    type: 'number',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'location_net',
                                    headerName: 'Ortsnetz',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'phone',
                                    headerName: 'Telefon',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'telefax',
                                    headerName: 'Telefax',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'mobile_num',
                                    headerName: 'Telex',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'contact',
                                    headerName: 'Bearbeiter',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'suppliernr',
                                    headerName: 'Lief-Nr',
                                    type: 'number',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'discount',
                                    headerName: 'K-rabatt',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'volume_discount_per',
                                    headerName: 'Mengenrab in to',
                                    type: 'string',
                                    editable: true,
                                    width: 100
                                    , hide: true
                                },
                                {
                                    field: 'volume_discount',
                                    headerName: 'Mengenrab in %',
                                    type: 'string',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'payment_condition',
                                    headerName: 'Kundenspezifische Zahlungsbedingungen',
                                    type: 'boolean',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'payment_target',
                                    headerName: 'Allg. Zahlungsziel',
                                    type: 'string',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'deadline1',
                                    headerName: 'Frist 1',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'deadline1_percent',
                                    headerName: 'Tage 1',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'deadline2',
                                    headerName: 'Frist 2',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'deadline2_percent',
                                    headerName: 'Tage 2',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'deadline3',
                                    headerName: 'Frist 3',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'deadline3_percent',
                                    headerName: 'Tage 3',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'insurance_sum',
                                    headerName: 'Versicherungssumme',
                                    type: 'string',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'open_pos',
                                    headerName: 'offen Posten',
                                    type: 'string',
                                    editable: true,
                                    width: 100,
                                    hide: true
                                },
                                {
                                    field: 'record_select',
                                    headerName: 'Datensatz selekt.',
                                    type: 'string',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'discount_carry',
                                    headerName: 'Rabatt Träger schn.',
                                    type: 'string',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'discount_all',
                                    headerName: 'Alles skontieren',
                                    type: 'boolean',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'bonus',
                                    headerName: 'Bonus',
                                    type: 'boolean',
                                    editable: true,
                                    width: 100, hide: true
                                },
                                {
                                    field: 'bonus_contract_date',
                                    headerName: 'Vertrag vom',
                                    type: 'date',
                                    editable: true,
                                    width: 100, hide: true
                                },
                            ]}/>,
                        },
                        {
                            "category": "Kundensonderpreise",
                            "route": "/kundensonderpreiselist",
                            "navigationItems": [],
                            "component": <DataGridViewer showCreate={false}
                                                         viewer='client_article_special_price'
                                                         column={[
                                                             {
                                                                 field: 'client_id',
                                                                 headerName: 'Kundennummer',
                                                                 type: 'number',
                                                                 editable: false,
                                                                 width: 100
                                                             },
                                                             {
                                                                 field: 'article_id',
                                                                 headerName: 'Artikelnummer',
                                                                 type: 'string',
                                                                 editable: false,
                                                                 width: 150
                                                             },
                                                             {
                                                                 field: 'amount',
                                                                 headerName: 'Kundensonderpreis',
                                                                 type: 'number',
                                                                 editable: true,
                                                                 width: 250
                                                             },
                                                             {
                                                                 field: 'unit',
                                                                 headerName: 'Massenheit',
                                                                 type: 'string',
                                                                 editable: true,
                                                                 width: 250
                                                             },
                                                         ]}/>,
                        },
                        {
                            "category": "Kundenwarengrouprabatte",
                            "route": "/Kundenwarengrouprabatte",
                            "navigationItems": [],
                            "component": <DataGridViewer showCreate={false} viewer='client_article_group_special_price'
                                                         column={[
                                                             {
                                                                 field: 'client_id',
                                                                 headerName: 'Kundennummer',
                                                                 type: 'number',
                                                                 editable: false,
                                                                 width: 100
                                                             },
                                                             {
                                                                 field: 'article_id',
                                                                 headerName: 'Warrengruppe',
                                                                 type: 'string',
                                                                 editable: false,
                                                                 width: 150
                                                             },
                                                             {
                                                                 field: 'amount_per',
                                                                 headerName: 'warengrouprabatte %',
                                                                 type: 'number',
                                                                 editable: true,
                                                                 width: 250
                                                             },
                                                             {
                                                                 field: 'unit',
                                                                 headerName: 'Massenheit',
                                                                 type: 'string',
                                                                 editable: true,
                                                                 width: 250
                                                             },
                                                         ]}/>,
                        }
                    ]
                },
                "Lieferantenlisten": {
                    "route": '/lieferantenlisten',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='supplier' column={[
                        {field: 'id', headerName: 'Lieferanten-Nummer', type: 'number', editable: false, width: 100},
                        {field: 'alias', headerName: 'SuchName', type: 'string', editable: true, width: 150},
                        {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                        {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                        {field: 'person', headerName: 'Person', type: 'string', editable: true, width: 250, hide: true},
                        {field: 'title', headerName: 'Anrede', type: 'string', editable: true, width: 250, hide: true},
                        {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                        {field: 'postal_code', headerName: 'PLZ', type: 'number', editable: true, width: 100},
                        {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 100},
                        {field: 'iban', headerName: 'IBAN', type: 'string', editable: true, width: 100},
                        {field: 'bic', headerName: 'SWIFT-BIC', type: 'string', editable: true, width: 100, hide: true},
                        {field: 'bank_code', headerName: 'BLZ', type: 'string', editable: true, width: 100, hide: true},
                        {field: 'bank', headerName: 'BANK', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'bank_account',
                            headerName: 'Bank Konto',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'select_set',
                            headerName: 'Datensatz selektieren',
                            type: 'boolean',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'vehicle_typ',
                            headerName: 'Versandart',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'min_order_amount',
                            headerName: 'Mindestbestellmenge',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'shipping_free_amount',
                            headerName: 'Fracht frei ab',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'payment_target',
                            headerName: 'Allg. Zahlungsziel',
                            type: 'number',
                            editable: true,
                            width: 100
                        },
                        {
                            field: 'pre_number',
                            headerName: 'Vorwahl',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true,
                        },
                        {
                            field: 'mobile_phone',
                            headerName: 'Mobile Telefonnummer',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {field: 'phone', headerName: 'Telefon', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'telefax',
                            headerName: 'Telefax',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'contact',
                            headerName: 'Bearbeiter',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'customer_ext_number',
                            headerName: 'Ext-Kunden-Nr',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'discount',
                            headerName: 'K-rabatt',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline_1',
                            headerName: 'Frist 1',
                            type: 'string',
                            editable: true,
                            width: 100,
                        },
                        {
                            field: 'deadline_1_per',
                            headerName: 'Tage 1',
                            type: 'string',
                            editable: true,
                            width: 100,
                        },
                        {
                            field: 'deadline_2',
                            headerName: 'Frist 2',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline_2_per',
                            headerName: 'Tage 2',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline_3',
                            headerName: 'Frist 3',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline_3_per',
                            headerName: 'Tage 3',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                    ]}/>,
                    "categories": null,
                },
                "Warengruppenliste": {
                    "route": '/warrengroupenliste',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='article_groups' editableId column={[
                        {field: 'id', headerName: 'Warengruppennummer', type: 'string', editable: false, width: 150},
                        {field: 'description', headerName: 'Bezeichnung', type: 'string', editable: true, width: 250},
                        {
                            field: 'group_surcharge_amount',
                            headerName: 'Warengrouppenzuschlag €',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'group_surcharge_per',
                            headerName: 'Warengrouppenzuschlag %',
                            type: 'number',
                            editable: true,
                            width: 300
                        },
                        {
                            field: 'group_discount',
                            headerName: 'Warengrouppenrabatt',
                            type: 'number',
                            editable: true,
                            width: 300
                        },

                    ]}/>,
                    "categories": null
                },
                "Artikellisten": {
                    "route": '/artikelliste',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='article' editableId column={[
                        {field: 'id', headerName: 'Artikelnummer', type: 'number', editable: false, width: 100},
                        {field: 'name0', headerName: 'Bezeichnung1', type: 'string', editable: true, width: 250},
                        {field: 'name1', headerName: 'Bezeichnung2', type: 'string', editable: true, width: 250},
                        {
                            field: 'weight',
                            headerName: 'Gewicht',
                            type: 'number',
                            editable: true,
                            width: 250,
                            hide: true
                        },
                        {
                            field: 'unit1',
                            headerName: 'Massenheit',
                            type: 'string',
                            editable: true,
                            width: 250,
                            hide: true
                        },
                        {field: 'articleprice', headerName: 'Artikelpreis', type: 'number', editable: true, width: 250},
                        {
                            field: 'surcharge_process',
                            headerName: 'Zuschlag für Bearbeitung',
                            type: 'number',
                            editable: true,
                            width: 100
                        },
                        {
                            field: 'purchase_price',
                            headerName: 'Einkaufspreis',
                            type: 'number',
                            editable: true,
                            width: 100
                        },
                        {
                            field: 'surcharge_cut',
                            headerName: 'Träger schneiden',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'stock',
                            headerName: 'Bestand',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'reserved',
                            headerName: 'Reserviert',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {field: 'type', headerName: 'Type', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'length',
                            headerName: 'länge',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'width',
                            headerName: 'Breite',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'diameter',
                            headerName: 'Durchmesser',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                    ]}/>,
                    "categories": null,
                },
                "Materialverbrauch": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [
                        {
                            "category": "Materialverbrauch nach Artikel",
                            "route": "/materialverbrauch_nach_Artikel",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Frachtkosten",
                            "route": "/frachtkosten",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Frachtkosten pro Kostenstelle",
                            "route": "/Frachtkosten_pro_Kostenstelle",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Zuschläge Rechnung",
                            "route": "/zuschlaege_rechnung",
                            "navigationItems": [],
                            "component": null
                        },
                    ]
                },
                "Eingangs-Rechnungs-Listen": {
                    "route": null,
                    "navigationItems": [],
                    "component": null,
                    "categories": [
                        {
                            "category": "Liste Eingangs-Rechnungs-Buch",
                            "route": "/Liste_eingangs-rechnungs-buch",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Liste offene Verbindlichkeiten",
                            "route": "/liste_offene_verbindlichkeiten",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Kontenblatt",
                            "route": "/kontenblatt",
                            "navigationItems": [],
                            "component": null
                        },
                        {
                            "category": "Liste fällige Rechnungen",
                            "route": "/liste_faellige_rechnungen",
                            "navigationItems": [],
                            "component": null
                        },
                    ]
                },
                "Liste Materialzugänge": {
                    "route": '/liste_materialzugaenge',
                    "navigationItems": [],
                    "component": <DataGridViewer showCreate={false} viewer='incoming_material' column={[
                        {field: 'id', headerName: 'Satznummer', type: 'number', editable: false, width: 100},
                        {field: 'article_id', headerName: 'Artikelnr.', type: 'string', editable: false, width: 150},
                        {field: 'supplier_id', headerName: 'Liferant', type: 'number', editable: false, width: 250},
                        {field: 'price', headerName: 'Einkaufspreis', type: 'number', editable: true, width: 250},
                        {field: 'amount', headerName: 'Menge', type: 'number', editable: true, width: 250},
                        {field: 'date', headerName: 'Datum', type: 'date', editable: true, width: 250},
                    ]}/>,
                    "categories": null
                },
                "Rechnungsausgangsbuch": {
                    "route": '/rechnungsausgangsbuch',
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Auftragsbuch (Datum)": {
                    "route": '/auftragsbuch_datum',
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Auftragsbuch (Auf-Nr)": {
                    "route": '/auftragsbuch_auf-nr',
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Auftragsbuch (Rechnungen)": {
                    "route": '/auftragsbuch_rechnungen',
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
                "Liste Kostenstellen": {
                    "route": '/liste_kostenstellen',
                    "navigationItems": [],
                    "component": <DataGridViewer editableId viewer='cost_center' column={[
                        {field: 'id', headerName: 'KST', type: 'string', editable: false, width: 250},
                        {field: 'project', headerName: 'BV', type: 'string', editable: true, width: 250},
                        {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                        {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                        {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                        {field: 'postal_code', headerName: 'Plz', type: 'string', editable: true, width: 250},
                        {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 250},
                        {field: 'price_10', headerName: 'Stahl 10', type: 'number', editable: true, width: 250},
                        {field: 'price_12_32', headerName: 'Stahl 12-32', type: 'number', editable: true, width: 250},
                        {field: 'price_hem', headerName: 'HEM', type: 'number', editable: true, width: 250},
                        {field: 'price_heb', headerName: 'HEB', type: 'number', editable: true, width: 250},
                        {
                            field: 'cut',
                            headerName: 'Matten schneiden pro To',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'cut_pce',
                            headerName: 'Matten schneiden pro Stuck',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {field: 'bend', headerName: 'Matten biegen pro To', type: 'number', editable: true, width: 250},
                        {
                            field: 'bend_pce',
                            headerName: 'Matten biegen pro Stuck',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'carry_discount',
                            headerName: 'Träger schneiden',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target',
                            headerName: 'Allg Zahlungsziel 1',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target2',
                            headerName: 'Allg Zahlungsziel 2',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target_day',
                            headerName: 'Skontoabzuege 1',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target2_day',
                            headerName: 'Skontoabzuege 2',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target_per',
                            headerName: 'Skontoabzuege 1 %',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'payment_target2_per',
                            headerName: 'Skontoabzuege 2 %',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'price_ipe',
                            headerName: 'IPE/U Träger',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'price_steel_stick',
                            headerName: 'Stabstahl',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {field: 'price_mat', headerName: 'Matten Q/R', type: 'number', editable: true, width: 250},
                        {field: 'price_hea', headerName: 'HEA', type: 'number', editable: true, width: 250},
                        {field: 'price_6', headerName: 'ST 6', type: 'number', editable: true, width: 250},
                        {field: 'price_8', headerName: 'ST 8', type: 'number', editable: true, width: 250},
                        {field: 'price_sheet', headerName: 'Bleche', type: 'number', editable: true, width: 250},
                    ]}/>,
                    "categories": null
                },
                "Liste Sicherheitseinbehalt": {
                    "route": '/liste_sicherheitseinbehalt',
                    "navigationItems": [],
                    "component": null,
                    "categories": null
                },
            }
        },
    },
    "Stammdaten": {
        'Kunden Stammdaten': {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Kundenstammdaten": {
                    "route": '/kundenstammdaten',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='client' column={[
                        {field: 'id', headerName: 'Kundennummer', type: 'number', editable: false, width: 100},
                        {field: 'alias', headerName: 'SuchName', type: 'string', editable: true, width: 150},
                        {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                        {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                        {field: 'person', headerName: 'Person', type: 'string', editable: true, width: 250, hide: true},
                        {field: 'title', headerName: 'Anrede', type: 'string', editable: true, width: 250, hide: true},
                        {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                        {field: 'postal_code', headerName: 'PLZ', type: 'number', editable: true, width: 100},
                        {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 100},
                        {field: 'country', headerName: 'Land', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'pre_number',
                            headerName: 'Vorwahl',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'location_net',
                            headerName: 'Ortsnetz',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {field: 'phone', headerName: 'Telefon', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'telefax',
                            headerName: 'Telefax',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'mobile_num',
                            headerName: 'Telex',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'contact',
                            headerName: 'Bearbeiter',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'suppliernr',
                            headerName: 'Lief-Nr',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'discount',
                            headerName: 'K-rabatt',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'volume_discount_per',
                            headerName: 'Mengenrab in to',
                            type: 'string',
                            editable: true,
                            width: 100
                            , hide: true
                        },
                        {
                            field: 'volume_discount',
                            headerName: 'Mengenrab in %',
                            type: 'string',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'payment_condition',
                            headerName: 'Kundenspezifische Zahlungsbedingungen',
                            type: 'boolean',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'payment_target',
                            headerName: 'Allg. Zahlungsziel',
                            type: 'string',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'deadline1',
                            headerName: 'Frist 1',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline1_percent',
                            headerName: 'Tage 1',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline2',
                            headerName: 'Frist 2',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline2_percent',
                            headerName: 'Tage 2',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline3',
                            headerName: 'Frist 3',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'deadline3_percent',
                            headerName: 'Tage 3',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'insurance_sum',
                            headerName: 'Versicherungssumme',
                            type: 'string',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'open_pos',
                            headerName: 'offen Posten',
                            type: 'string',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'record_select',
                            headerName: 'Datensatz selekt.',
                            type: 'string',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'discount_carry',
                            headerName: 'Rabatt Träger schn.',
                            type: 'string',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'discount_all',
                            headerName: 'Alles skontieren',
                            type: 'boolean',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'bonus',
                            headerName: 'Bonus',
                            type: 'boolean',
                            editable: true,
                            width: 100, hide: true
                        },
                        {
                            field: 'bonus_contract_date',
                            headerName: 'Vertrag vom',
                            type: 'date',
                            editable: true,
                            width: 100, hide: true
                        },
                    ]}/>,
                    "categories": null
                },
                "Kundensonderpreise": {
                    "route": '/kundensonderpreise',
                    "navigationItems": [],
                    "component": <ClientSpecialPrice sourceCollection='article'
                                                     targetCollection="client_article_special_price"/>,
                    "categories": null
                },
                "Kundenwarengruppenrabatt": {
                    "route": '/kundenwarengruppenrabatt',
                    "navigationItems": [],
                    "component": <ClientSpecialPrice sourceCollection='article_groups'
                                                     targetCollection="client_article_group_special_price"/>,
                    "categories": null
                },
            }
        },
        'Lieferanten Stammdaten': {
            "route": '/lieferantenstammdaten',
            "navigationItems": [],
            "component": <DataGridViewer viewer='supplier' column={[
                {field: 'id', headerName: 'Lieferanten-Nummer', type: 'number', editable: false, width: 100},
                {field: 'alias', headerName: 'SuchName', type: 'string', editable: true, width: 150},
                {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                {field: 'person', headerName: 'Person', type: 'string', editable: true, width: 250, hide: true},
                {field: 'title', headerName: 'Anrede', type: 'string', editable: true, width: 250, hide: true},
                {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                {field: 'postal_code', headerName: 'PLZ', type: 'number', editable: true, width: 100},
                {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 100},
                {field: 'iban', headerName: 'IBAN', type: 'string', editable: true, width: 100},
                {field: 'bic', headerName: 'SWIFT-BIC', type: 'string', editable: true, width: 100, hide: true},
                {field: 'bank_code', headerName: 'BLZ', type: 'string', editable: true, width: 100, hide: true},
                {field: 'bank', headerName: 'BANK', type: 'string', editable: true, width: 100, hide: true},
                {
                    field: 'bank_account',
                    headerName: 'Bank Konto',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'select_set',
                    headerName: 'Datensatz selektieren',
                    type: 'boolean',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'vehicle_typ',
                    headerName: 'Versandart',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'min_order_amount',
                    headerName: 'Mindestbestellmenge',
                    type: 'number',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'shipping_free_amount',
                    headerName: 'Fracht frei ab',
                    type: 'number',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'payment_target',
                    headerName: 'Allg. Zahlungsziel',
                    type: 'number',
                    editable: true,
                    width: 100
                },
                {
                    field: 'pre_number',
                    headerName: 'Vorwahl',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true,
                },
                {
                    field: 'mobile_phone',
                    headerName: 'Mobile Telefonnummer',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {field: 'phone', headerName: 'Telefon', type: 'string', editable: true, width: 100, hide: true},
                {
                    field: 'telefax',
                    headerName: 'Telefax',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'contact',
                    headerName: 'Bearbeiter',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'customer_ext_number',
                    headerName: 'Ext-Kunden-Nr',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'discount',
                    headerName: 'K-rabatt',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'deadline_1',
                    headerName: 'Frist 1',
                    type: 'string',
                    editable: true,
                    width: 100,
                },
                {
                    field: 'deadline_1_per',
                    headerName: 'Tage 1',
                    type: 'string',
                    editable: true,
                    width: 100,
                },
                {
                    field: 'deadline_2',
                    headerName: 'Frist 2',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'deadline_2_per',
                    headerName: 'Tage 2',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'deadline_3',
                    headerName: 'Frist 3',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
                {
                    field: 'deadline_3_per',
                    headerName: 'Tage 3',
                    type: 'string',
                    editable: true,
                    width: 100,
                    hide: true
                },
            ]}/>,
            "subMenus": null
        },
        'Artikel Stammdaten': {
            "route": null,
            "navigationItems": [],
            "component": null,
            "subMenus": {
                "Warrengruppen": {
                    "route": '/warengruppen',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='article_groups' editableId column={[
                        {field: 'id', headerName: 'Warengruppennummer', type: 'string', editable: false, width: 150},
                        {field: 'description', headerName: 'Bezeichnung', type: 'string', editable: true, width: 250},
                        {
                            field: 'group_surcharge_amount',
                            headerName: 'Warengrouppenzuschlag €',
                            type: 'number',
                            editable: true,
                            width: 250
                        },
                        {
                            field: 'group_surcharge_per',
                            headerName: 'Warengrouppenzuschlag %',
                            type: 'number',
                            editable: true,
                            width: 300
                        },
                        {
                            field: 'group_discount',
                            headerName: 'Warengrouppenrabatt',
                            type: 'number',
                            editable: true,
                            width: 300
                        },

                    ]}/>,
                    "categories": null
                },
                "Artikel": {
                    "route": '/artikel',
                    "navigationItems": [],
                    "component": <DataGridViewer viewer='article' editableId column={[
                        {field: 'id', headerName: 'Artikelnummer', type: 'number', editable: false, width: 100},
                        {field: 'name0', headerName: 'Bezeichnung1', type: 'string', editable: true, width: 250},
                        {field: 'name1', headerName: 'Bezeichnung2', type: 'string', editable: true, width: 250},
                        {
                            field: 'weight',
                            headerName: 'Gewicht',
                            type: 'number',
                            editable: true,
                            width: 250,
                            hide: true
                        },
                        {
                            field: 'unit1',
                            headerName: 'Massenheit',
                            type: 'string',
                            editable: true,
                            width: 250,
                            hide: true
                        },
                        {field: 'articleprice', headerName: 'Artikelpreis', type: 'number', editable: true, width: 250},
                        {
                            field: 'surcharge_process',
                            headerName: 'Zuschlag für Bearbeitung',
                            type: 'number',
                            editable: true,
                            width: 100
                        },
                        {
                            field: 'purchase_price',
                            headerName: 'Einkaufspreis',
                            type: 'number',
                            editable: true,
                            width: 100
                        },
                        {
                            field: 'surcharge_cut',
                            headerName: 'Träger schneiden',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'stock',
                            headerName: 'Bestand',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'reserved',
                            headerName: 'Reserviert',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {field: 'type', headerName: 'Type', type: 'string', editable: true, width: 100, hide: true},
                        {
                            field: 'length',
                            headerName: 'länge',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'width',
                            headerName: 'Breite',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                        {
                            field: 'diameter',
                            headerName: 'Durchmesser',
                            type: 'number',
                            editable: true,
                            width: 100,
                            hide: true
                        },
                    ]}/>,
                    "categories": null
                },
            }
        },
        'Lieferarten': {
            "route": '/lieferarten',
            "navigationItems": [],
            "component": <DataGridViewer viewer='shipping_method' column={[
                {field: 'id', headerName: 'Lieferart-Id', type: 'number', editable: false, width: 250},
                {field: 'method', headerName: 'Lieferart', type: 'string', editable: false, width: 250},
            ]}/>,
            "subMenus": null
        },
        'Bestellarten': {
            "route": '/bestellarten',
            "navigationItems": [],
            "component": <DataGridViewer viewer='order_method' column={[
                {field: 'id', headerName: 'Versandart-Id', type: 'number', editable: false, width: 250},
                {field: 'method', headerName: 'Versandart', type: 'string', editable: false, width: 250},
            ]}/>,
            "subMenus": null
        },
        'Kostenstellen': {
            "route": '/kostenstellen',
            "navigationItems": [],
            "component": <DataGridViewer editableId viewer='cost_center' column={[
                {field: 'id', headerName: 'KST', type: 'string', editable: false, width: 250},
                {field: 'project', headerName: 'BV', type: 'string', editable: true, width: 250},
                {field: 'name1', headerName: 'Name 1', type: 'string', editable: true, width: 250},
                {field: 'name2', headerName: 'Name 2', type: 'string', editable: true, width: 250},
                {field: 'street', headerName: 'Strasse', type: 'string', editable: true, width: 250},
                {field: 'postal_code', headerName: 'Plz', type: 'string', editable: true, width: 250},
                {field: 'location', headerName: 'Ort', type: 'string', editable: true, width: 250},
                {field: 'price_10', headerName: 'Stahl 10', type: 'number', editable: true, width: 250},
                {field: 'price_12_32', headerName: 'Stahl 12-32', type: 'number', editable: true, width: 250},
                {field: 'price_hem', headerName: 'HEM', type: 'number', editable: true, width: 250},
                {field: 'price_heb', headerName: 'HEB', type: 'number', editable: true, width: 250},
                {
                    field: 'cut',
                    headerName: 'Matten schneiden pro To',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'cut_pce',
                    headerName: 'Matten schneiden pro Stuck',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {field: 'bend', headerName: 'Matten biegen pro To', type: 'number', editable: true, width: 250},
                {
                    field: 'bend_pce',
                    headerName: 'Matten biegen pro Stuck',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'carry_discount',
                    headerName: 'Träger schneiden',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target',
                    headerName: 'Allg Zahlungsziel 1',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target2',
                    headerName: 'Allg Zahlungsziel 2',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target_day',
                    headerName: 'Skontoabzuege 1',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target2_day',
                    headerName: 'Skontoabzuege 2',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target_per',
                    headerName: 'Skontoabzuege 1 %',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'payment_target2_per',
                    headerName: 'Skontoabzuege 2 %',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'price_ipe',
                    headerName: 'IPE/U Träger',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {
                    field: 'price_steel_stick',
                    headerName: 'Stabstahl',
                    type: 'number',
                    editable: true,
                    width: 250
                },
                {field: 'price_mat', headerName: 'Matten Q/R', type: 'number', editable: true, width: 250},
                {field: 'price_hea', headerName: 'HEA', type: 'number', editable: true, width: 250},
                {field: 'price_6', headerName: 'ST 6', type: 'number', editable: true, width: 250},
                {field: 'price_8', headerName: 'ST 8', type: 'number', editable: true, width: 250},
                {field: 'price_sheet', headerName: 'Bleche', type: 'number', editable: true, width: 250},
            ]}/>,
            "subMenus": null,
        },
        'Auftragsbuch': {
            "route": '/auftragsbuch',
            "navigationItems": [],
            "component": <DataGridViewer viewer='orders_grid'
                                         showCreate={false}
                                         column={[
                                             {
                                                 field: 'id',
                                                 headerName: 'AuftragsNr',
                                                 type: 'number',
                                                 editable: false,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_id',
                                                 headerName: 'KundenNr',
                                                 type: 'number',
                                                 editable: false,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_id',
                                                 headerName: 'KST',
                                                 type: 'string',
                                                 editable: false,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_alias',
                                                 headerName: 'SuName',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_address1_name1',
                                                 headerName: 'Name 1',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_address1_name2',
                                                 headerName: 'Name 2',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_address1_street',
                                                 headerName: 'Strasse',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_address1_post',
                                                 headerName: 'PLZ',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'client_address1_place',
                                                 headerName: 'Ort',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_address2_name1',
                                                 headerName: 'KST Name 1',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_address2_name2',
                                                 headerName: 'KST Name 2',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_address2_street',
                                                 headerName: 'KST Strasse',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_address2_post',
                                                 headerName: 'KST PLZ',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'cost_address2_place',
                                                 headerName: 'KST Ort',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'sheet',
                                                 headerName: 'Bleche',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'hem',
                                                 headerName: 'HEM',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'stahl6',
                                                 headerName: 'Stahl 6',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'stahl8',
                                                 headerName: 'Stahl 8',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'stahl10',
                                                 headerName: 'Stahl 10',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'stahl12_32',
                                                 headerName: 'Stahl 12-32',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'matten_q',
                                                 headerName: 'Matten Q',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'matten_r',
                                                 headerName: 'Matten R',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'hea',
                                                 headerName: 'HEA',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'heb',
                                                 headerName: 'HEB',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'stabstahl',
                                                 headerName: 'Stabstahl',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bv_1',
                                                 headerName: 'BV 1',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bv_2',
                                                 headerName: 'BV 2',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bv_3',
                                                 headerName: 'BV 3',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'ipe',
                                                 headerName: 'IPE/U',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'plan',
                                                 headerName: 'Plan',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bestelldatum',
                                                 headerName: 'Bestelldatum',
                                                 type: 'date',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'lieferdatum',
                                                 headerName: 'Lieferdatum',
                                                 type: 'date',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bearbeiter',
                                                 headerName: 'bearbeiter',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bem',
                                                 headerName: 'Bemerkung',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'bauteilt',
                                                 headerName: 'Bauteilt',
                                                 type: 'string',
                                                 editable: true,
                                                 width: 250
                                             },
                                             {
                                                 field: 'mehrwertssteuer',
                                                 headerName: 'Mehrwertssteuer',
                                                 type: 'number',
                                                 editable: true,
                                                 width: 250
                                             },
                                         ]}/>,
            "subMenus": null
        },
    },
    "Produktion": {
        'Nachkalkulation Datum': {
            "route": "/nachkalkulation_datum",
            "navigationItems": [],
            "component": null,
            "subMenus": null
        },
        'Nachkalkulation Auftrag': {
            "route": "/nachkalkulation_auftrag",
            "navigationItems": [],
            "component": null,
            "subMenus": null
        },
        'Liste unfertige Produktion': {
            "route": "/liste_unfertige_produktion",
            "navigationItems": [],
            "component": null,
            "subMenus": null
        },
    }
}