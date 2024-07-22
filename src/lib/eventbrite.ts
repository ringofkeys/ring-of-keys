const BASE_URL = "https://www.eventbriteapi.com/v3"
/**
 *  NOTE: This Organization ID is hard-coded to save on fetch requests.
 *  If it ever changes, use getOrganizationId() to get a new one, or wire that function
 *  up to get the true ID on each request if necessary.
 */
const ORGANIZATION_ID = "454257230738"

type EventbritePagination = {
    "object_count": number,
    "page_number": number,
    "page_size": number,
    "page_count": number,
    "continuation": string,
    "has_more_items": boolean,
}

type EventbriteOrganization = {
    "name": string,
    "vertical": string,
    "image_id": string,
    "id": string,
}

type EventbriteOrganizationResponse = {
    "pagination": EventbritePagination,
    "organizations": EventbriteOrganization[]
  }

export function getOrganizationId(privateToken: string): Promise<EventbriteOrganizationResponse> {
    return fetch(`${BASE_URL}/users/me/organizations/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${privateToken}`,
        },
    }).then(res => res.json())
}



export function getEvents(privateToken: string): Promise<EventbriteEventList> {
    return fetch(`${BASE_URL}/organizations/${ORGANIZATION_ID}/events/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${privateToken}`,
        },
    }).then(res => res.json())
}

export type EventbriteEventList = {
    pagination: EventbritePagination,
    events: EventbriteEvent[]
}

export type EventbriteEvent = {
    id: string,
    name: {
        text: string,
        html: string,
    },
    description: {
        text: string,
        html: string,
    },
    summary: string,
    start: {
        timezone: string,
        utc: string,
        local: string,
    },
    end: {
        timezone: string,
        utc: string,
        local: string,
    },
    url: string,
    vanity_url: string,
    created: string,
    changed: string,
    published: string,
    status: string,
    currency: string,
    online_event: boolean,
    format_id: string | null,
    format: {
        id: string,
        name: string,
        name_localized: string,
        short_name: string,
        short_name_localized: string,
        resource_uri: string,
    },
    category: {
        id: string,
        resource_uri: string,
        name: string,
        name_localized: string,
        short_name: string,
        short_name_localized: string,
        subcategories: {
            id: string,
            resource_uri: string,
            name: string,
            parent_category: {},
        }[]
    },
    subcategory: {
        id: string,
        resource_uri: string,
        name: string,
        parent_category: {
            id: string,
            resource_uri: string,
            name: string,
            name_localized: string,
            short_name: string,
            short_name_localized: string,
            subcategories: {},
        },
    },
    music_properties: {
        age_restriction: string | null,
        presented_by: string | null,
        door_time: string,
    },
    bookmark_info: {
        bookmarked: boolean,
    },
    ticket_availability: {
        has_available_tickets: boolean,
        minimum_ticket_price: {
            currency: string,
            value: number,
            major_value: string,
            display: string,
        },
        maximum_ticket_price: {
            currency: string,
            value: number,
            major_value: string,
            display: string,
        },
        is_sold_out: boolean,
        start_sales_date: {
            timezone: string,
            utc: string,
            local: string,
        },
        waitlist_available: boolean,
    },
    listed: boolean,
    shareable: boolean,
    invite_only: boolean,
    show_remaining: boolean,
    password: string,
    capacity: number,
    capacity_is_custom: boolean,
    tx_time_limit: string,
    hide_start_date: boolean,
    hide_end_date: boolean,
    locale: string,
    is_locked: boolean,
    privacy_setting: string,
    is_externally_ticketed: boolean,
    external_ticketing: {
        external_url: string,
        ticketing_provider_name: string,
        is_free: boolean,
        minimum_ticket_price: {
            currency: string,
            value: number,
            major_value: string,
            display: string,
        },
        maximum_ticket_price: {
            currency: string,
            value: number,
            major_value: string,
            display: string,
        },
        sales_start: string,
        sales_end: string,
    },
    is_series: boolean,
    is_series_parent: boolean,
    series_id: string,
    is_reserved_seating: boolean,
    show_pick_a_seat: boolean,
    show_seatmap_thumbnail: boolean,
    show_colors_in_seatmap_thumbnail: boolean,
    is_free: boolean,
    source: string,
    version: string,
    resource_uri: string,
    event_sales_status: {
        sales_status: string,
        start_sales_date: {
            timezone: string,
            utc: string,
            local: string,
        },
    },
    checkout_settings: {
        created: string,
        changed: string,
        country_code: string,
        currency_code: string,
        checkout_method: string,
        offline_settings: {
            payment_method: string,
            instructions: string,
        }[],
        user_instrument_vault_id: string,
    },
    organization_id: string,
    organizer_id: string,
    organizer: {
        name: string,
        description: {
            text: string,
            html: string,
        },
        long_description: {
            text: string,
            html: string,
        },
        logo_id: string | null,
        logo: {
            id: string,
            url: string,
            crop_mask: {
                top_left: {
                    y: number,
                    x: number,
                },
                width: number,
                height: number,
            },
            original: {
                url: string,
                width: number,
                height: number,
            },
            aspect_ratio: string,
            edge_color: string,
            edge_color_set: boolean,
        },
        resource_uri: string,
        id: string,
        url: string,
        num_past_events: number,
        num_future_events: number,
        twitter: string,
        facebook: string,
    },
    logo_id: string | null,
    logo: {
        id: string,
        url: string,
        crop_mask: {
            top_left: {
                y: number,
                x: number,
            },
            width: number,
            height: number,
        },
        original: {
            url: string,
            width: number,
            height: number,
        },
        aspect_ratio: string,
        edge_color: string,
        edge_color_set: boolean,
    },
    venue: {
        name: string,
        age_restriction: string | null,
        capacity: number,
        address: {
            address_1: string | null,
            address_2: string | null,
            city: string | null,
            region: string | null,
            postal_code: string | null,
            country: string | null,
            latitude: string | null,
            longitude: string | null,
        },
        resource_uri: string,
        id: string,
        latitude: string,
        longitude: string,
    },
}