package com.scichart.testapp;

import android.graphics.Color;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.scichart.charting.model.dataSeries.XyDataSeries;
import com.scichart.charting.modifiers.ModifierGroup;
import com.scichart.charting.modifiers.PinchZoomModifier;
import com.scichart.charting.modifiers.ZoomExtentsModifier;
import com.scichart.charting.modifiers.ZoomPanModifier;
import com.scichart.charting.visuals.SciChartSurface;
import com.scichart.charting.visuals.axes.AxisAlignment;
import com.scichart.charting.visuals.axes.IAxis;
import com.scichart.charting.visuals.axes.NumericAxis;
import com.scichart.charting.visuals.renderableSeries.FastLineRenderableSeries;
import com.scichart.drawing.common.PenStyle;

import java.util.Collections;

/**
 * A placeholder fragment containing a simple view.
 */
public class MainActivityFragment extends Fragment {

    public MainActivityFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View view = inflater.inflate(R.layout.fragment_main, container, false);

        // find surface by id from layout
        final SciChartSurface surface = (SciChartSurface) view.findViewById(R.id.chart);

        // create xAxis with some range
        final IAxis xAxis = new NumericAxis(getActivity());
        xAxis.setAxisAlignment(AxisAlignment.Bottom);

        // add xAxis to XAxes collection of surface
        Collections.addAll(surface.getXAxes(), xAxis);

        // define yAxis
        final IAxis yAxis = new NumericAxis(getActivity());
        yAxis.setAxisAlignment(AxisAlignment.Right);

        // add yAxis to YAxes collection of surface
        Collections.addAll(surface.getYAxes(), yAxis);


        // create and fill data series
        final XyDataSeries<Double, Double> series = new XyDataSeries<>(Double.class, Double.class);
        for (int i = 0; i < 100; i++) {
            series.append(Double.valueOf(i), Double.valueOf(i*i));
        }

        // create FastLinesSeries
        FastLineRenderableSeries rs = new FastLineRenderableSeries();
        rs.setStrokeStyle(new PenStyle(Color.GREEN, true, 5));
        rs.setDataSeries(series);

        // add series into chart
        Collections.addAll(surface.getRenderableSeries(), rs);

        // create and assign modifier collection
        final ModifierGroup modifierGroup = new ModifierGroup(new PinchZoomModifier(),
                new ZoomPanModifier().setReceiveHandledEvents(true),
                new ZoomExtentsModifier().setReceiveHandledEvents(true));
        surface.setChartModifier(modifierGroup);

        return view;
    }
}
