/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

// Interface for iModels
export interface IBIMModel {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    height: number;
}
