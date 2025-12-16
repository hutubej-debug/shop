import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST add price to history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, price } = body;

    if (!productId || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'productId and price are required',
        },
        { status: 400 }
      );
    }

    const priceHistory = await prisma.priceHistory.create({
      data: {
        productId: parseInt(productId),
        price: parseFloat(price),
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: priceHistory,
      message: 'Price added to history',
    });
  } catch (error) {
    console.error('Error adding price:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add price',
      },
      { status: 500 }
    );
  }
}

// GET price history for a product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'productId is required',
        },
        { status: 400 }
      );
    }

    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        productId: parseInt(productId),
      },
      orderBy: { recordedAt: 'desc' },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: priceHistory,
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch price history',
      },
      { status: 500 }
    );
  }
}
