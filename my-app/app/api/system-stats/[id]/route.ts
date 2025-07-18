import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateSystemStatsSchema } from '../../schemas'

// Get a single system stats record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const stats = await prisma.systemStats.findUnique({
      where: { id }
    })
    
    if (!stats) {
      return NextResponse.json({ error: 'System stats not found' }, { status: 404 })
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch system stats:', error)
    return NextResponse.json({ error: 'Failed to fetch system stats' }, { status: 500 })
  }
}

// Update system stats
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateSystemStatsSchema.parse(body)
    
    const stats = await prisma.systemStats.update({
      where: { id },
      data: validatedData
    })
    
    return NextResponse.json(stats)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'System stats not found' }, { status: 404 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update system stats:', error)
    return NextResponse.json({ error: 'Failed to update system stats' }, { status: 500 })
  }
}

// Delete system stats
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.systemStats.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'System stats deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'System stats not found' }, { status: 404 })
    }
    console.error('Failed to delete system stats:', error)
    return NextResponse.json({ error: 'Failed to delete system stats' }, { status: 500 })
  }
}
