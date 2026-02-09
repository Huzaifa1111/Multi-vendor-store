import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private addressesRepository: Repository<Address>,
    ) { }

    async findAll(userId: number): Promise<Address[]> {
        return this.addressesRepository.find({ where: { userId } });
    }

    async findOne(id: number, userId: number): Promise<Address> {
        const address = await this.addressesRepository.findOne({ where: { id, userId } });
        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found`);
        }
        return address;
    }

    async create(userId: number, addressData: Partial<Address>): Promise<Address> {
        // If setting as default, unset other defaults
        if (addressData.isDefault) {
            await this.addressesRepository.update({ userId }, { isDefault: false });
        }

        const address = this.addressesRepository.create({ ...addressData, userId });
        return this.addressesRepository.save(address);
    }

    async update(id: number, userId: number, addressData: Partial<Address>): Promise<Address> {
        const address = await this.findOne(id, userId);

        if (addressData.isDefault) {
            await this.addressesRepository.update({ userId }, { isDefault: false });
        }

        Object.assign(address, addressData);
        return this.addressesRepository.save(address);
    }

    async remove(id: number, userId: number): Promise<void> {
        const address = await this.findOne(id, userId);
        await this.addressesRepository.remove(address);
    }
}
