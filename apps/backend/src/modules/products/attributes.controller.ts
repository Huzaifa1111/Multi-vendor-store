import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttributesService } from './attributes.service';

@Controller('attributes')
export class AttributesController {
    constructor(private readonly attributesService: AttributesService) { }

    @Get()
    async findAll() {
        return this.attributesService.findAll();
    }

    @Get('values')
    async findValues(@Query('attribute') attribute: string, @Query('q') query: string) {
        return this.attributesService.findValuesByAttribute(attribute, query);
    }

    @Post('values')
    async createValue(@Body() body: { attribute: string; value: string }) {
        return this.attributesService.createAttributeValue(body.attribute, body.value);
    }
}
